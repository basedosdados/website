#!/usr/bin/env python3
from pydantic import (
    StrictStr as Str,
    Field,
)

from ckanext.basedosdados.validator import BaseModel

# -------------------------------------
# Dataset Custom Types
# -------------------------------------
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

ORGANIZATION_FIELD = Field(
    title="Organization ID",
    user_input_hint=["<organização>"],
    description=to_line(
        [
            "Qual organização disponibiliza os dados originais?",
            "Opções: escolher dessa lista -> https://basedosdados.org/api/3/action/organization_list=",
        ]
    ),
    yaml_order={
        "id_after": None,
        "id_before": "dataset_id",
    },
)

DATASET_ID_FIELD = Field(
    title="Dataset ID",
    yaml_order={
        "id_after": "organization",
        "id_before": "title",
    },
)

TITLE_FIELD = Field(
    title="Título",
    user_input_hint=["<Um título descritivo>"],
    yaml_order={
        "id_after": "dataset_id",
        "id_before": "description",
    },
)

DESCRIPTION_FIELD = Field(
    title="Descrição",
    user_input_hint=["<exemplo: descrição e anotações úteis sobre os dados.>"],
    description=to_line(["exemplo: descrição e anotações úteis sobre os dados."]),
    yaml_order={
        "id_after": "title",
        "id_before": "groups",
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
        "id_after": "description",
        "id_before": "tags",
    },
)

TAGS_FIELD = Field(
    title="tags",
    user_input_hint=["<exemplo: fertilidade, preco, desmatamento>"],
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
        "id_after": "groups",
        "id_before": "spatial_coverage",
    },
)

SPATIAL_COVERAGE_FIELD = Field(
    title="Cobertura espacial",
    yaml_order={
        "id_after": "tags",
        "id_before": "temporal_coverage",
    },
)

TEMPORAL_COVERAGE_FIELD = Field(
    title="Cobertura temporal",
    yaml_order={
        "id_after": "spatial_coverage",
        "id_before": "observation_level",
    },
)

UPDATE_FREQUENCY_FIELD = Field(
    title="",
    yaml_order={
        "id_after": "temporal_coverage",
        "id_before": "observation_level",
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
        "id_after": "observation_level",
        "id_before": "ckan_url",
    },
)

CKAN_URL_FIELD = Field(
    title="ckan_url",
    user_input_hint=["<https://basedosdados.org/dataset/<dataset_id>"],
    yaml_order={
        "id_after": "time_unit",
        "id_before": "github_url",
    },
)

GITHUB_URL_FIELD: Str = Field(
    title="github_url",
    user_input_hint=[
        "<https://github.com/basedosdados/mais/tree/master/bases/<dataset_id>"
    ],
    yaml_order={
        "id_after": "ckan_url",
        "id_before": "visibility",
    },
)

VISIBILITY_FIELD = Field(
    title="Visibilidade",
    yaml_order={
        "id_after": "github_url",
        "id_before": "download_type",
    },
)

DOWNLOAD_TYPE_FIELD = Field(
    title="Tipo de download",
    yaml_order={
        "id_after": "visibility",
        "id_before": "metadata_modified",
    },
)

METADATA_MODIFIED_FIELD = Field(
    title="metadata_modified",
    yaml_order={
        "id_after": "download_type",
        "id_before": "author",
    },
)

AUTHOR_FIELD = Field(
    title="author",
    description=to_line(["Qual departamento/grupo/pessoa mantém os dados originais?"]),
    yaml_order={
        "id_after": "metadata_modified",
        "id_before": None,
    },
)
