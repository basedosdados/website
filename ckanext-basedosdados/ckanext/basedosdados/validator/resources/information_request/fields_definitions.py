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

# -------------------------------------
# InformationRequest Fields
# -------------------------------------
DATASET_ID_FIELD = Field(
    title="Dataset ID",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


ORIGIN_FIELD = Field(
    title="Origem",
    description=to_line([""]),
    user_input_hint=["<>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

NUMBER_FIELD = Field(
    title="Número",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

URL_FIELD = Field(
    title="Url",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

DEPARTMENT_FIELD = Field(
    title="",
    description=to_line([""]),
    user_input_hint=["<>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

OPENING_DATE_FIELD = Field(
    title="Data de abertura",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

REQUESTED_BY_FIELD = Field(
    title="Quem fez o pedido",
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

STATUS_FIELD = Field(
    title="Status",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

DATA_URL_FIELD = Field(
    title="Url dos dados",
    description=to_line(["Onde estão os dados da resposta?"]),
    user_input_hint=["<www.example.com/data>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

OBSERVATIONS_FIEL = Field(
    title="Observações",
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
