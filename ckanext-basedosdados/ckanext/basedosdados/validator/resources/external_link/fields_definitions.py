#!/usr/bin/env python3
from pydantic import (
    StrictStr as Str,
    Field,
)
from ckanext.basedosdados.validator import BaseModel

to_line = lambda description: "\n".join(description)

# -------------------------------------
# ExternalLink Fields
# -------------------------------------

METADATA_MODIFIED_FIELD = Field(
    title="metadata_modified",
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

URL_FIELD = Field(
    title="Url",
    user_input_hint=["<www.example.com/data>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

DESCRIPTION_FIELD = Field(
    title="Descrição",
    description=to_line(
        [
            "Descreva a tabela. Essas são as primeiras frases que um usuário vai ver.",
            "Você não precisa ser muito conciso. Sinta-se a vontade para dar exemplos de",
            "como usar os dados.",
            "Se souber, liste também aplicações: pesquisa, apps, etc. que usem os dados.,",
        ]
    ),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

LANGUAGE_FIELD = Field(
    title="Língua",
    description=to_line(["Em quais línguas a fonte externa está disponível."]),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

HAS_STRUCTURED_DATA_FIELD = Field(
    title="Tem dados estruturados?",
    description=to_line(
        [
            "A fonte externa disponibiliza dados em formatos estruturados, como csv, json, etc?"
        ]
    ),
    user_input_hint=["<Sim/Não>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

HAS_API_FIELD = Field(
    title="Tem uma API?",
    description=to_line(
        ["A fonte externa disponibiliza uma API para acesso aos dados?"]
    ),
    user_input_hint=["<Sim/Não>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

IS_FREE_FIELD = Field(
    title="É de graça?",
    description=to_line(["O acesso aos dados da fonte externa é grátis?"]),
    user_input_hint=["<Sim/Não>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

REQUIRES_REGISTRATION_FIELD = Field(
    title="Requer registro",
    description=to_line(
        ["A fonte externa requer registro de usuário para acesso aos dados?"]
    ),
    user_input_hint=["<Sim/Não>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

AVAILABILITY_FIELD = Field(
    title="Disponibilidade",
    description=to_line(["Como os dados são disponibilizados?"]),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

COUNTRY_IP_ADDRESS_REQUIRED_FIELD = Field(
    title="Requer ip do país?",
    description=to_line([""]),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

LICENSE_FIELD = Field(
    title="Tipo de licença de acesso",
    description=to_line(
        ["Qual tipo de licença regula acesso aos dados da fonte externa?"]
    ),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

SPATIAL_COVERAGE_FIELD = Field(
    title="Cobertura espacial",
    description=to_line(["A máxima unidade espacial que a tabela cobre."]),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

TEMPORAL_COVERAGE_FIELD = Field(
    title="Cobertura temporal",
    description=to_line(["Anos cobertos pela tabela."]),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

OBSERVATION_LEVEL_FIELD = Field(
    title="Entidade",
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
        "id_before": "",
        "id_after": "",
    },
)

UPDATE_FREQUENCY_FIELD = Field(
    title="Frequência de atualização",
    user_input_hint=["<frequência>"],
    description=to_line(
        [
            "A unidade temporal pela qual a tabela é atualizada.",
            "Opções: hora | dia | semana | mes | 1 ano | 2 anos | 5 anos | 10 anos | unico | recorrente",
        ]
    ),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


TIME_UNIT_FIELD = Field(
    title="Unidade temporal",
    description=to_line(
        [
            "A unidade temporal representada por cada linha.",
            "Opções: hora | dia | semana | mes | 1 ano | 2 anos | 5 anos | 10 anos | unico | recorrente",
        ]
    ),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)
