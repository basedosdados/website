#!/usr/bin/env python3
from pydantic import (
    StrictStr as Str,
    Field,
)
from ckanext.basedosdados.validator import BaseModel


class RequestedBy(BaseModel):
    name: Str = Field(user_input_hint=["<nome [você]>"])
    code_url: Str = Field(
        user_input_hint=[
            "https://github.com/basedosdados/mais/tree/master/bases/<dataset_id>/code"
        ]
    )
    website: Str = Field(user_input_hint=["<website>"])
    email: Str = Field(user_input_hint=["<email>"])

to_line = lambda description: "\n".join(description)

###################
### YAML FIELDS ###
###################

DATASET_ID_FIELD = Field(
    title="dataset_id",
    user_input_hint=["<dataset_id>"],
    description=to_line(["AUTO GENERATED"]),
    yaml_order={
        "id_before": "metadata_modified",
        "id_after": "table_id",
    },
)


DESCRIPTION_FIELD = Field(
    title="description",
    user_input_hint=["<descrição>"],
    description=to_line(
        [
            "Descreva a tabela. Essas são as primeiras frases que um usuário vai ver.",
            "Você não precisa ser muito conciso. Sinta-se a vontade para dar exemplos de",
            "como usar os dados.",
            "Se souber, liste também aplicações: pesquisa, apps, etc. que usem os dados.,",
        ]
    ),
    yaml_order={
        "id_before": "version",
        "id_after": "published_by",
    },
)

SPATIAL_COVERAGE_FIELD = Field(
    title="spatial_coverage",
    user_input_hint=[
        "<admin0 - pais>",
        "<admin1 - estados/regioes/etc>",
        "<admin2 - municipios/counties/etc>",
        "<admin3 - distritos/subdistritos/etc>",
    ],
    description=to_line(
        [
            "Qual é a cobertura espacial da tabela?",
            "Regras:",
            "  - minúsculo, sem acento, singular",
            "  - descer até o menor nível administrativo cuja cobertura abaixo seja 'todos'",
            "Exemplo 1: tabela que cubra todos os municípios nos estados de SP e GO",
            "  - brasil",
            "  - SP, GO",
            "Exemplo 2: tabela que cubra países inteiros na América Latina",
            "  - brasil, argentina, peru, equador",
        ]
    ),
    yaml_order={
        "id_before": "primary_keys",
        "id_after": "temporal_coverage",
    },
)

OBSERVATION_LEVEL_FIELD = Field(
    title="observation_level",
    user_input_hint=["<primeira coluna>"],
    description=to_line(
        [
            "Nível da observação (qual é a granularidade de cada linha na tabela)",
            "Escolha todas as opções necessárias.",
            "Regras:",
            "  - minúsculo, sem acento, singular.",
            "  - em portugues (ou seja, não use os nomes de colunas abaixo)",
            "Exemplos: pais, estado, municipio, cidade, hora, dia, semana, mes, ano, etc.",
        ]
    ),
    max_items=10,
    yaml_order={
        "id_before": "update_frequency",
        "id_after": "primary_keys",
    },
)

TEMPORAL_COVERAGE_FIELD = Field(
    title="temporal_coverage",
    user_input_hint=["<ano 1>", "<ano 2>"],
    description=to_line(
        [
            "Qual é a cobertura temporal (em anos) da tabela?",
            "Opções: ..., 1990, 1991, ..., 1999, 2000, 2001, ..., 2019, 2020, ...",
        ]
    ),
    yaml_order={
        "id_before": "spatial_coverage",
        "id_after": "partitions",
    },
)

UPDATE_FREQUENCY_FIELD = Field(
    title="update_frequency",
    user_input_hint=["<frequência>"],
    description=to_line(
        [
            "Com qual frequência a base é atualizada?",
            "Opções: hora | dia | semana | mes | 1 ano | 2 anos | 5 anos | 10 anos | unico | recorrente",
        ]
    ),
    yaml_order={
        "id_before": "treatment_description",
        "id_after": "observation_level",
    },
)

TIME_UNIT_FIELD = Field(
    title="Unidade temporal",
    user_input_hint=["<unidade temporal>"],
    description=to_line(
        [
            "Qual é a unidade de tempo dos dados cobertos pelo pedido?",
            "Opções: hora | dia | semana | mes | 1 ano | 2 anos | 5 anos | 10 anos | unico | recorrente",
        ]
    ),
    yaml_order={
        "id_before": "treatment_description",
        "id_after": "observation_level",
    },
)
