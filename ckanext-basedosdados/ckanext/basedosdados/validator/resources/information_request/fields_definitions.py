#!/usr/bin/env python3

from typing import Optional

from ckanext.basedosdados.validator import BaseModel
from pydantic import Field
from pydantic import StrictStr as Str

to_line = lambda description: "\n".join(description)

# -------------------------------------
# InformationRequest Custom Types
# -------------------------------------

class RequestedBy(BaseModel):
    # fmt: off
    name        : Optional[Str] = Field(title="Nome",description=to_line(["<nome [você]>"]))
    email       : Optional[Str] = Field(title="Email",description=to_line(["<email>"]))
    github_user : Optional[Str] = Field(title="Usuário Github",description=to_line(["<usuário Github>"]))
    website     : Optional[Str] = Field(title="Website",description=to_line(["<website>"]))
    ckan_user   : Optional[Str] = Field(title="Usuário CKAN",description=to_line(["<ID do usuário no CKAN>"]))
    # fmt: on


class PartnerOrganization(BaseModel):
    # fmt: off
    name            : Optional[Str] = Field(title="Nome",description=to_line(["Nome completo"]))
    organization_id : Optional[Str] = Field(title="ID Organização",description=to_line(["ID Organização - CKAN"]))
    # fmt: on


# -------------------------------------
# InformationRequest Fields
# -------------------------------------

DATASET_ID_FIELD = Field(
    title="ID Conjunto",
    yaml_order={
        "id_after": None,
        "id_before": "origin",
    },
)

ORIGIN_FIELD = Field(
    title="Origem",
    description=to_line(
        [
            "Origem do pedido",
            "Exemplos: FalaBr, Senado, SIC-SP, etc."
        ]
    ),
    yaml_order={
        "id_after": "dataset_id",
        "id_before": "number",
    },
)

NUMBER_FIELD = Field(
    title="Número",
    description=to_line(
        [
            "Número de pedido."
        ]
    ),
    yaml_order={
        "id_after": "origin",
        "id_before": "url",
    },
)

URL_FIELD = Field(
    title="Url",
    description=to_line(
        [
            "Url onde está disponível o pedido."
        ]
    ),
    yaml_order={
        "id_after": "number",
        "id_before": "department",
    },
)

DEPARTMENT_FIELD = Field(
    title="Departamento",
    description=to_line(
        [
            "Departamento/Órgão vinculado"
        ]
    ),
    yaml_order={
        "id_after": "url",
        "id_before": "description",
    },
)

DESCRIPTION_FIELD = Field(
    title="Descrição",
    description=to_line(
        [
            "Descreva o pedido.",
            "Você não precisa ser muito conciso. Sinta-se a vontade para explicar a origem do pedido e outras informações relevantes.",
        ]
    ),
    yaml_order={
        "id_after": "department",
        "id_before": "opening_date",
    },
)

OPENING_DATE_FIELD = Field(
    title="Data de Abertura",
    description=to_line(
        [
            "Formato YYYY-MM-DD"
        ]
    ),
    yaml_order={
        "id_after": "description",
        "id_before": "requested_by",
    },
)

REQUESTED_BY_FIELD = Field(
    title="Quem Fez o Pedido",
    yaml_order={
        "id_after": "opening_date",
        "id_before": "spatial_coverage",
    },
)

SPATIAL_COVERAGE_FIELD = Field(
    title="Cobertura Espacial",
    description=to_line(
        [
            "A máxima unidade espacial que os dados pedidos cobrem."
        ]
    ),
    yaml_order={
        "id_after": "requested_by",
        "id_before": "temporal_coverage",
    },
)

TEMPORAL_COVERAGE_FIELD = Field(
    title="Cobertura Temporal",
    description=to_line(
        [
            "Anos cobertos pelos dados pedidos."
            "Preencher como lista de intervalos.",
            "Exemplos: 1995(1)2018 ou (1)2020."
        ]
    ),
    yaml_order={
        "id_after": "spatial_coverage",
        "id_before": "update_frequency",
    },
)

UPDATE_FREQUENCY_FIELD = Field(
    title="Frequência de Atualização",
    description=to_line(
        [
            "A unidade temporal na qual os dados pedidos são atualizados.",
            "Opções em 'time_unit' em https://basedosdados.org/api/3/action/bd_available_options."
        ]
    ),
    yaml_order={
        "id_after": "temporal_coverage",
        "id_before": "observation_level",
    },
)

OBSERVATION_LEVEL_FIELD = Field(
    title="Nível da observação",
    description=to_line(
        [
            "Nível de observação dos dados: o que representa cada linha.",
        ]
    ),
    yaml_order={
        "id_before": "update_frequency",
        "id_after": "status",
    },
)

STATUS_FIELD = Field(
    title="Status",
    description=to_line(
        [
            "Estado do pedido."
            "Opções em 'status' em https://basedosdados.org/api/3/action/bd_available_options."
        ]
    ),
    yaml_order={
        "id_after": "entity",
        "id_before": "data_url",
    },
)

DATA_URL_FIELD = Field(
    title="Url dos Dados",
    description=to_line(
        [
            "Onde estão os dados da resposta?",
            "Exemplo: www.exemplo.com/dados.csv"
        ]
    ),
    yaml_order={
        "id_after": "status",
        "id_before": "observations",
    },
)

OBSERVATIONS_FIELD = Field(
    title="Observações",
    yaml_order={
        "id_after": "data_url",
        "id_before": "partner_organization",
    },
)

PARTNER_ORGANIZATION_FIELD = Field(
    title="Organização parceira",
    description=to_line(["Organização que ajudou institucionalmente na criação ou disponibilização do pedido de informação."]),
    yaml_order={
        "id_before": "observations",
        "id_after": None,
    },
)

