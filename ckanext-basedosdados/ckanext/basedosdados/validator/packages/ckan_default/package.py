#!/usr/bin/env python3
from __future__ import annotations

from datetime import datetime
from typing import Any, List, Literal, Optional, Union
from uuid import UUID

from ckanext.basedosdados.validator import BaseModel
from ckanext.basedosdados.validator.available_options import IdType
from ckanext.basedosdados.validator.resources import BdmTable, ExternalLink
from pydantic import Extra, Field
from pydantic import StrictInt as Int
from pydantic import StrictStr as Str
from pydantic import root_validator, validator
from typing_extensions import Annotated  # migrate to py3.9

Email = Str  # TODO

AnyResource = Annotated[
    Union[ExternalLink, BdmTable], Field(discriminator="resource_type")
]

coerce_to_unicode = lambda field: validator("field", allow_reuse=True)()

### Do not use extra while creating new models
class _CkanDefaults(BaseModel):  # , extra=Extra.forbid):
    
    id: IdType
    
    name             : Str                                               = Field(title="Nome")
    title            : Str                                               = Field(title="Título")
    type             : Literal["dataset"]                                = Field(title="Tipo")
    notes            : Optional[Str]                                     = Field(title="Notas")
    author           : Optional[Str]
    author_email     : Optional[Email]
    maintainer       : Optional[Str]
    maintainer_email : Optional[Email]
    state            : Optional[Literal["active", "draft", "deleted"]]  = Field(title="Estado")
    license_id       : Optional[Str]                                    = Field(title="ID da Licença")
    url              : Optional[Str]                                    = Field(title="Url")
    version          : Optional[Str]                                    = Field(title="Versão")
    metadata_created : Optional[datetime]                               = Field(title="Data de Criação")
    metadata_modified: Optional[datetime]                               = Field(title="Data de Modificação")
    creator_user_id  : Optional[UUID]                                   = Field(title="ID do(a) Usuário(a) Criador(a)")
    private          : bool                                             = Field(title="Privado")
    license_title    : Optional[Str]                                    = Field(title="Título da Licença")
    # fmt: on

    # Ckan Defaults Complex Fields
    # fmt: off
    num_resources: Optional[Int]                                        = Field(title="Número de Recursos")
    resources    : List[AnyResource] = []
    groups       : Any                                                  = Field(title="Temas")
    owner_org    : UUID
    organization : Any                                                  = Field(title="Organização")
    num_tags     : Optional[Int]
    tags         : Any                                                  = Field(title="Etiquetas")

    relationships_as_object: Any
    relationships_as_subject: Any

    # throwaway field that is used to modify validators. You can think of it as an
    # argument to validate function. Cant use prefix underscores on pydantic so used suffix to indicate this
    action__: Optional[
        Literal["package_show", "package_create", "package_update"]
    ]  # TODO: after 2021-07-01 add exclude by default when issue is merged in master

    # -------------------------------------
    # VALIDATORS
    # -------------------------------------
    @validator("resources", pre=True)
    def resources_should_have_position_field(cls, resources):
        for idx, r in enumerate(resources):
            # idx = (idx) # need to be string cause ckan is dumb and will treat an int 0
            # as a false value causing problems in later validations
            # assert r.get('position') is None or r['position'] == idx,
            # f"Position on resource {r.get('name')} is {r['position']!r} but should be {idx!r}."
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

    # Using root_validator I can guarantee that all individual fields are ready.
    # Using `values` on single field validators prooved to hard to synchronize
    @root_validator
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
