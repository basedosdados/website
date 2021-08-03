#!/usr/bin/env python3
from typing import Optional, Set
from pydantic import (
    StrictStr as Str,
    Field,
)
from ckanext.basedosdados.validator import BaseModel
from ckanext.basedosdados.validator.available_options import (
    ContinentEnum,
    CountryEnum,
    Admin1Enum,
    Admin2Enum
)

# -------------------------------------
# InformationRequest Custom Types
# -------------------------------------

class SpatialCoverage(BaseModel):
    
    #TODO definir campo complexo de spatial_coverage
    # 1. ler os dataframes de diretorios para estrurar árvore de dicts e metadados
        # incluir IDs de entidades e nomes
    # 2. transformar isso num dict para front-end
    continent : Optional[Set[ContinentEnum]] = Field(user_input_hint=["Continente"])
    country   : Optional[Set[CountryEnum]]   = Field(user_input_hint=["País"])
    admin1    : Optional[Set[Admin1Enum]]    = Field(user_input_hint=["UF/Estado"])
    admin2    : Optional[Set[Admin2Enum]]    = Field(user_input_hint=["Município/Condado"])
    #admin3    : Optional[Str] = Field(user_input_hint=["Distrito"])

class RequestedBy(BaseModel):
    name        : Str = Field(user_input_hint=["<nome [você]>"])
    email       : Str = Field(user_input_hint=["<email>"])
    github_user : Str = Field(user_input_hint=["<usuário Github>"])
    website     : Str = Field(user_input_hint=["<website>"])
    ckan_user   : Str = Field(user_input_hint=["<ID do usuário no CKAN>"])


to_line = lambda description: "\n".join(description)

# -------------------------------------
# InformationRequest Fields
# -------------------------------------

DATASET_ID_FIELD = Field(
    title="Dataset ID",
    yaml_order={
        "id_after": None,
        "id_before": "origin",
    },
)

ORIGIN_FIELD = Field(
    title="Origem",
    description=to_line(["Origem do pedido"]),
    user_input_hint=["<FalaBr, Senado, SIC-SP, etc>"],
    yaml_order={
        "id_after": "dataset_id",
        "id_before": "number",
    },
)

NUMBER_FIELD = Field(
    title="Número",
    yaml_order={
        "id_after": "origin",
        "id_before": "url",
    },
)

URL_FIELD = Field(
    title="Url",
    yaml_order={
        "id_after": "number",
        "id_before": "department",
    },
)

DEPARTMENT_FIELD = Field(
    title="Departamento",
    description=to_line(["Departamento/Órgão vinculado"]),
    user_input_hint=["<>"],
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
    title="Data de abertura",
    yaml_order={
        "id_after": "description",
        "id_before": "requested_by",
    },
)

REQUESTED_BY_FIELD = Field(
    title="Quem fez o pedido",
    yaml_order={
        "id_after": "opening_date",
        "id_before": "spatial_coverage",
    },
)

SPATIAL_COVERAGE_FIELD = Field(
    title="Cobertura espacial",
    description=to_line(["A máxima unidade espacial que os dados pedidos cobrem."]),
    yaml_order={
        "id_after": "requested_by",
        "id_before": "temporal_coverage",
    },
)

TEMPORAL_COVERAGE_FIELD = Field(
    title="Cobertura temporal",
    description=to_line(["Anos cobertos pelos dados pedidos."]),
    yaml_order={
        "id_after": "spatial_coverage",
        "id_before": "update_frequency",
    },
)

UPDATE_FREQUENCY_FIELD = Field(
    title="Frequência de atualização",
    description=to_line(
        [
            "A unidade temporal na qual os dados pedidos são atualizados.",
        ]
    ),
    yaml_order={
        "id_after": "temporal_coverage",
        "id_before": "entity",
    },
)

ENTITY_FIELD = Field(
    title="Entidade",
    description=to_line(["Entidade coberta pelos dados pedidos."]),
    max_items=10,
    yaml_order={
        "id_after": "update_frequency",
        "id_before": "time_unit",
    },
)

TIME_UNIT_FIELD = Field(
    title="Unidade temporal",
    description=to_line(
        ["A unidade temporal representada por cada linha dos dados pedidos."]
    ),
    yaml_order={
        "id_after": "entity",
        "id_before": "status",
    },
)

STATUS_FIELD = Field(
    title="Status",
    yaml_order={
        "id_after": "time_unit",
        "id_before": "data_url",
    },
)

DATA_URL_FIELD = Field(
    title="Url dos dados",
    description=to_line(["Onde estão os dados da resposta?"]),
    user_input_hint=["<www.exemplo.com/dados>"],
    yaml_order={
        "id_after": "status",
        "id_before": "observations",
    },
)

OBSERVATIONS_FIELD = Field(
    title="Observações",
    yaml_order={
        "id_after": "data_url",
        "id_before": None,
    },
)
