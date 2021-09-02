#!/usr/bin/env python3
from typing import Optional, Set

from ckanext.basedosdados.validator import BaseModel

from pydantic import Field
from pydantic import StrictStr as Str

# -------------------------------------
# Dataset Custom Types
# -------------------------------------


to_line = lambda description: "\n".join(description)

# -------------------------------------
# Dataset Fields
# -------------------------------------

ORGANIZATION_FIELD = Field(
    title="ID Organização",
    user_input_hint=["<organização>"],
    description=to_line(
        [
            "Qual organização disponibiliza os dados originais?",
            "Opções: escolher dessa lista -> https://basedosdados.org/api/3/action/organization_list=",
        ]
    ),
    yaml_order={
        "id_before": None,
        "id_after": "dataset_id",
    },
)

DATASET_ID_FIELD = Field(
    title="ID Base",
    yaml_order={
        "id_before": "organization",
        "id_after": "title",
    },
)

TITLE_FIELD = Field(
    title="Título",
    user_input_hint=["<Um título descritivo>"],
    yaml_order={
        "id_before": "dataset_id",
        "id_after": "description",
    },
)

DESCRIPTION_FIELD = Field(
    title="Descrição",
    user_input_hint=["<exemplo: descrição e anotações úteis sobre os dados.>"],
    description=to_line(["exemplo: descrição e anotações úteis sobre os dados."]),
    yaml_order={
        "id_before": "title",
        "id_after": "groups",
    },
)

GROUPS_FIELD = Field(
    title="Temas",
    user_input_hint=["<grupo>"],
    description=to_line(
        [
            "Quais grupos caracterizam a base?",
            "Opções: escolher dessa lista -> https://basedosdados.org/api/3/action/group_list",
        ]
    ),
    yaml_order={
        "id_before": "description",
        "id_after": "tags",
    },
)

TAGS_FIELD = Field(
    title="Etiquetas",
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
        "id_before": "groups",
        "id_after": "spatial_coverage",
    },
)

SPATIAL_COVERAGE_FIELD = Field(
    title="Cobertura Espacial",
    yaml_order={
        "id_before": "tags",
        "id_after": "temporal_coverage",
    },
)

TEMPORAL_COVERAGE_FIELD = Field(
    title="Cobertura Temporal",
    yaml_order={
        "id_before": "spatial_coverage",
        "id_after": "entity",
    },
)

UPDATE_FREQUENCY_FIELD = Field(
    title="Frequência de Atualização",
    yaml_order={
        "id_before": "temporal_coverage",
        "id_after": "entity",
    },
)

ENTITY_FIELD = Field(
    title="Entidade",
    description=to_line(["Entidade representada por cada linha."]),
    max_items=10,
    yaml_order={
        "id_before": "update_frequency",
        "id_after": "time_unit",
    },
)

TIME_UNIT_FIELD = Field(
    title="Unidade Temporal",
    yaml_order={
        "id_before": "entity",
        "id_after": "ckan_url",
    },
)

CKAN_URL_FIELD = Field(
    title="Url CKAN",
    user_input_hint=["<https://basedosdados.org/dataset/<dataset_id>"],
    yaml_order={
        "id_before": "time_unit",
        "id_after": "github_url",
    },
)

GITHUB_URL_FIELD: Str = Field(
    title="Url Github",
    user_input_hint=[
        "<https://github.com/basedosdados/mais/tree/master/bases/<dataset_id>"
    ],
    yaml_order={
        "id_before": "ckan_url",
        "id_after": "metadata_modified",
    },
)

VISIBILITY_FIELD = Field(title="Visibilidade")

DOWNLOAD_TYPE_FIELD = Field(
    title="Tipo de Download",
)

METADATA_MODIFIED_FIELD = Field(
    title="Data de Modificação",
    yaml_order={
        "id_before": "github_url",
        "id_after": None,
    },
)

AUTHOR_FIELD = Field(
    title="Autor(a)",
    description=to_line(["Qual departamento/grupo/pessoa mantém os dados originais?"]),
)
