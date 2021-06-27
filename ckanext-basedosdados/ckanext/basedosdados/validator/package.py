#!/usr/bin/env python3
from __future__ import annotations
from datetime import datetime
from enum import Enum
from typing import List, Optional, Literal, Union, Any, Dict
import pydantic
from pydantic import (
    StrictInt as Int,
    StrictStr as Str,
    Field,
    ValidationError,
    validator,
    PrivateAttr,
    root_validator,
)
from uuid import UUID
import jsonschema

from .data_types import ObservationLevel, TemporalCoverage, IdType

from typing_extensions import Annotated  # migrate to py3.9

Email = Str  # TODO

from . import BaseModel
from .resource import ExternalLink, BdmTable

AnyResource = Annotated[
    Union[ExternalLink, BdmTable], Field(discriminator="resource_type")
]


coerce_to_unicode = lambda field: validator("field", allow_reuse=True)()


class _CkanDefaults(BaseModel):
    id: IdType
    name: Str

    title: Str
    type: Literal["dataset"]
    notes: Optional[Str]
    # author: Optional[Str]
    author_email: Optional[Email]
    maintainer: Optional[Str]
    maintainer_email: Optional[Email]
    state: Optional[Literal["active", "draft", "deleted"]]
    license_id: Optional[Str]
    url: Optional[Str]
    version: Optional[Str]
    metadata_created: Optional[datetime]
    # metadata_modified: Optional[datetime]
    creator_user_id: Optional[UUID]
    private: bool
    license_title: Optional[Str]

    # Ckan Defaults Complex Fields
    num_resources: Optional[Int]
    resources: List[AnyResource] = []
    groups: Any
    owner_org: UUID
    # organization: Any
    num_tags: Optional[Int]
    tags: Any

    relationships_as_object: Any
    relationships_as_subject: Any

    # throwaway field that is used to modify validators. You can think of it as an argument to validate function. Cant use prefix underscores on pydantic so used suffix to indicate this
    action__: Optional[
        Literal["package_show", "package_create", "package_update"]
    ]  # TODO: after 2021-07-01 add exclude by default when issue is merged in master

    @validator("resources", pre=True)
    def resources_should_have_position_field(cls, resources):
        for idx, r in enumerate(resources):
            # idx = (idx) # need to be string cause ckan is dumb and will treat an int 0 as a false value causing problems in later validations
            # assert r.get('position') is None or r['position'] == idx, f"Position on resource {r.get('name')} is {r['position']!r} but should be {idx!r}."
            r["position"] = idx
        return resources

    @root_validator
    def ids_should_respect_action(cls, values):
        action = values["action__"]
        resources = values.get("resources", [])
        if action in ("package_update", "package_show"):
            assert values["id"] != None, f"package id is None on {action}"
        elif action == "package_create":
            assert values["id"] == None, "package id is not None on package_create"
            for idx, r in enumerate(resources):
                assert (
                    r.id == None
                ), f"resource #{idx!r} id field not is None: {r.id!r} on package_create"
        else:
            raise ValueError(f"action {action!r} not supported")
        if action == "package_show":
            for idx, r in enumerate(resources):
                assert r.id != None, f"resource {idx!r} id is None on {action}"
        return values

    @root_validator  # using root_validator I can guarantee that all individual fields are ready. Using `values` on single field validators prooved to hard to synchronize
    def not_null_on_show(cls, values):
        for f in (
            "state",
            "metadata_created",
            "metadata_modified",
            "creator_user_id",
            "num_resources",
            "num_tags",
        ):
            if values["action__"] == "package_show":
                assert values[f] is not None
        return values


class Author(BaseModel):
    name: Str = Field(default=["<nome>"])
    email: Str = Field(default=["<email>"])


class Licence(BaseModel):
    name: Str = Field(default=["MIT"])
    url: Str = Field(default=["<url>"])


class BdmDatasetConfigs(_CkanDefaults):
    ###################
    ### YAML FIELDS ###
    ###################
    metadata_modified: datetime = Field(
        title="metadata_modified",
        default=["<YYYY-MM-DD>"],
        description=["AUTO GENERATED"],
        yaml_order={
            "id_before": None,
            "id_after": "dataset_id",
        },
    )

    dataset_id: Str = Field(
        title="dataset_id",
        default=["<dataset_id>"],
        description=["AUTO GENERATED"],
        yaml_order={
            "id_before": "metadata_modified",
            "id_after": "url_ckan",
        },
    )

    url_ckan: Str = Field(
        title="url_ckan",
        default=["https://basedosdados.org/dataset/<dataset_id>"],
        description=["AUTO GENERATED"],
        yaml_order={
            "id_before": "dataset_id",
            "id_after": "url_github",
        },
    )

    url_github: Str = Field(
        title="url_github",
        default=["https://github.com/basedosdados/mais/tree/master/bases/<dataset_id>"],
        description=["AUTO GENERATED"],
        yaml_order={
            "id_before": "url_ckan",
            "id_after": "description",
        },
    )

    description: Str = Field(
        title="description",
        default=["<descrição>"],
        description=[
            "Descreva a base",
            "Ela é sobre o que?",
            "Quais as principais fontes de dados?",
            "Há links para FAQs e explicações?",
        ],
        yaml_order={
            "id_before": "url_github",
            "id_after": "organization",
        },
    )

    organization: Str = Field(
        title="organization",
        default=["<organização>"],
        description=[
            "Qual organização disponibiliza os dados originais?",
            "Opções: escolher dessa lista -> https://basedosdados.org/api/3/action/organization_list=",
        ],
        yaml_order={
            "id_before": "description",
            "id_after": "author",
        },
    )

    author: Author = Field(
        title="author",
        description=["Qual departamento/grupo/pessoa mantém os dados originais?"],
        yaml_order={
            "id_before": "organization",
            "id_after": "website",
        },
    )

    website: List[Str] = Field(
        title="website",
        default=["<website>"],
        description=["Onde encontrar os dados originais e mais informações?"],
        yaml_order={
            "id_before": "author",
            "id_after": "groups",
        },
    )

    groups: List[Str] = Field(
        title="groups",
        default=["<grupo>"],
        description=[
            "Quais grupos caracterizam a base?",
            "Opções: escolher dessa lista -> https://basedosdados.org/api/3/action/group_list",
        ],
        yaml_order={
            "id_before": "website",
            "id_after": "tags",
        },
    )

    tags: List[Str] = Field(
        title="tags",
        default=["<etiqueta>"],
        description=[
            "Quais etiquetas caracterizam a base?",
            "Opções: escolher dessa lista -> https://basedosdados.org/api/3/action/tag_list",
            "Caso crie etiquetas novas, as regras são:",
            "   - letras minúsculas",
            "   - sem acentos",
            "   - não repita nomes de grupos (ex. educacao, saude, meio ambiente, economia, etc.)",
        ],
        yaml_order={
            "id_before": "groups",
            "id_after": "languages",
        },
    )

    languages: List[Str] = Field(
        title="languages",
        default=["<língua>"],
        description=[
            "Em quais línguas a base (ou a fonte original) está disponível?",
            "Regras: minúsculo, sem acentos.",
            "Opções: portugues, ingles, espanhol, frances, chines, russo, hindi, alemao, etc.",
        ],
        yaml_order={
            "id_before": "tags",
            "id_after": "free",
        },
    )

    free: Str = Field(
        title="free",
        default=["<sim/não>"],
        description=["Os dados originais estão disponíveis de graça?"],
        yaml_order={
            "id_before": "languages",
            "id_after": "microdata",
        },
    )

    microdata: Str = Field(
        title="microdata",
        default=["<sim/não>"],
        description=["Os microdados estão disponíveis para download?"],
        yaml_order={
            "id_before": "free",
            "id_after": "API",
        },
    )

    API: Str = Field(
        title="API",
        default=["<sim/não>"],
        description=["Existe uma API na fonte original?"],
        yaml_order={
            "id_before": "microdata",
            "id_after": "registration",
        },
    )

    registration: Str = Field(
        title="registration",
        default=["<sim/não>"],
        description=[
            "É necessário registrar um usuário para baixar os dados originais?"
        ],
        yaml_order={
            "id_before": "API",
            "id_after": "availability",
        },
    )

    availability: Str = Field(
        title="availability",
        default=["<online/físico>"],
        description=["Como os dados originais estão disponibilizados?"],
        yaml_order={
            "id_before": "registration",
            "id_after": "brazilian_IP",
        },
    )

    brazilian_IP: Str = Field(
        title="brazilian_IP",
        default=["<sim/não>"],
        description=["A fonte original requer IP brasileiro para acesso?"],
        yaml_order={
            "id_before": "availability",
            "id_after": "license",
        },
    )

    license: Licence = Field(
        title="license",
        description=[
            "Essa base está sob qual licença?",
            "A licença MIT se aplica a bases públicas.",
            "Caso não seja pública, ver opções aqui: https://help.data.world/hc/en-us/articles/115006114287-Common-license-types-for-datasets",
        ],
        yaml_order={
            "id_before": "brazilian_IP",
            "id_after": None,
        },
    )


def bdm_dataset_schema_json():
    return BdmDatasetConfigs.schema_json(indent=2)


class Package(_CkanDefaults):
    # Generated Fields
    # temporal_coverage: TemporalCoverage
    # spatial_coverage: Str
    # observation_level: List[ObservationLevel] = Field(max_items=10)
    # auxiliary_files_url: List[Str]

    download_type: Optional[
        Literal["Link Externo", "BD Mais"]
    ]  # TODO: generate this automatically


# TODO: try to access fields on validation and get annotations on which fields are needed for each tier
