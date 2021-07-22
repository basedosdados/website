#!/usr/bin/env python3
from pydantic import (
    StrictStr as Str,
    Field,
)

from ckanext.basedosdados.validator import BaseModel

class Author(BaseModel):
    name: Str = Field(user_input_hint=["<nome>"])
    email: Str = Field(user_input_hint=["<email>"])

class Licence(BaseModel):
    name: Str = Field(user_input_hint=["MIT"])
    url: Str = Field(user_input_hint=["<url>"])

# TODO: define spatial_coverage fields
# class SpatialCoverage(BaseModel):
#     world:
#     continet:
#     country:
#     state:
#     city:

to_line = lambda description: "\n".join(description)

# -------------------------------------
# Dataset Fields
# -------------------------------------

AUTHOR_FIELD = Field(
    title="author",
    description=to_line(["Qual departamento/grupo/pessoa mantém os dados originais?"]),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

METADATA_MODIFIED_FIELD = Field(
    title="metadata_modified",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


GROUPS_FIELD = Field(
    title="groups",
    user_input_hint=["<grupo>"],
    description=to_line(
        [
            "Quais grupos caracterizam a base?",
            "Opções: escolher dessa lista -> https://basedosdados.org/api/3/action/group_list",
        ]
    ),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


ORGANIZATION_FIELD = Field(
    title="organization",
    user_input_hint=["<organização>"],
    description=to_line(
        [
            "Qual organização disponibiliza os dados originais?",
            "Opções: escolher dessa lista -> https://basedosdados.org/api/3/action/organization_list=",
        ]
    ),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

TAGS_FIELD = Field(
    title="tags",
    user_input_hint=["<etiqueta>"],
    description=to_line(
        [
            "Quais etiquetas caracterizam a base?",
            "Opções: escolher dessa lista -> https://basedosdados.org/api/3/action/tag_list",
            "Caso crie etiquetas novas, as regras são:",
            "   - letras minúsculas",
            "   - sem acentos",
            "   - não repita nomes de grupos (ex. educacao, saude, meio ambiente, economia, etc.)",
        ]
    ),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

DATASET_ID_FIELD = Field(
    title="Dataset ID",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


ORGANIZATION_ID_FIELD = Field(
    title="ID da organização",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

TITLE_FIELD = Field(
    title="Título",
    user_input_hint=["<Um título descritivo>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

DESCRIPTION_FIELD = Field(
    title="Descrição",
    user_input_hint=["<exemplo: descrição e anotações úteis sobre os dados.>"],
    description=to_line(["exemplo: descrição e anotações úteis sobre os dados."]),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

TAG_STRING_FIELD = Field(
    title="Etiquetas",
    user_input_hint=["<exemplo: fertilidade, preço, desmatamento>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


DOWNLOAD_TYPE_FIELD = Field(
    title="Tipo de download",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

SPATIAL_COVERAGE_FIELD = Field(
    title="Cobertura espacial",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


TEMPORAL_COVERAGE_FIELD = Field(
    title="Cobertura temporal",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

ENTITY_FIELD = Field(
    title="Entidade",
    description=to_line(["Entidade representada por cada linha."]),
    max_items=10,
    yaml_order={
        "id_after": "update_frequency",
        "id_before": "time_unit",
    },
)

TIME_UNIT_FIELD = Field(
    title="Unidade temporal",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

UPDATE_FREQUENCY_FIELD = Field(
    title="",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

CKAN_URL_FIELD = Field(
    title="ckan_url",
    user_input_hint=["<https://basedosdados.org/dataset/<dataset_id>"],
    yaml_order={
        "id_after": "project_id_staging",
        "id_before": "github_url",
    },
)

GITHUB_URL_FIELD: Str = Field(
    title="github_url",
    user_input_hint=["<https://github.com/basedosdados/mais/tree/master/bases/<dataset_id>"],
    yaml_order={
        "id_after": "ckan_url",
        "id_before": "partitions",
    },
)
