#!/usr/bin/env python3
from typing import Optional, Set

from ckanext.basedosdados.validator import BaseModel
from ckanext.basedosdados.validator.available_options import (
    Admin1Enum,
    Admin2Enum,
    ContinentEnum,
    CountryEnum,
)
from pydantic import Field

to_line = lambda description: "\n".join(description)

# -------------------------------------
# ExternalLink Custom Types
# -------------------------------------
class SpatialCoverage(BaseModel):

    # TODO definir campo complexo de spatial_coverage
    # 1. ler os dataframes de diretorios para estrurar árvore de dicts e metadados
    # incluir IDs de entidades e nomes
    # 2. transformar isso num dict para front-end

    # fmt: off
    continent : Optional[Set[ContinentEnum]] = Field(user_input_hint=["Continente"])
    country   : Optional[Set[CountryEnum]]   = Field(user_input_hint=["País"])
    admin1    : Optional[Set[Admin1Enum]]    = Field(user_input_hint=["UF/Estado"])
    admin2    : Optional[Set[Admin2Enum]]    = Field(user_input_hint=["Município/Condado"])
    # admin3    : Optional[Str] = Field(user_input_hint=["Distrito"])
    # fmt: on


# -------------------------------------
# ExternalLink Fields
# -------------------------------------

DATASET_ID_FIELD = Field(
    title="Dataset ID",
    yaml_order={
        "id_after": None,
        "id_before": "url",
    },
)

URL_FIELD = Field(
    title="Url",
    user_input_hint=["<www.example.com/data>"],
    yaml_order={
        "id_after": "dataset_id",
        "id_before": "title",
    },
)

TITLE_FIELD = Field(
    title="Título",
    user_input_hint=["<Um título descritivo>"],
    yaml_order={
        "id_before": "url",
        "id_after": "description",
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
        "id_after": "title",
        "id_before": "language",
    },
)

LANGUAGE_FIELD = Field(
    title="Língua",
    description=to_line(["Em quais línguas a fonte externa está disponível."]),
    yaml_order={
        "id_after": "description",
        "id_before": "has_structure_data",
    },
)

HAS_STRUCTURED_DATA_FIELD = Field(
    title="Tem dados estruturados?",
    description=to_line(
        [
            "A fonte externa disponibiliza dados em formatos estruturados, como csv, json, etc?"
        ]
    ),
    yaml_order={
        "id_after": "language",
        "id_before": "has_api",
    },
)

HAS_API_FIELD = Field(
    title="Tem uma API?",
    description=to_line(
        ["A fonte externa disponibiliza uma API para acesso aos dados?"]
    ),
    yaml_order={
        "id_after": "has_structured_data",
        "id_before": "is_free",
    },
)

IS_FREE_FIELD = Field(
    title="É de graça?",
    description=to_line(["O acesso aos dados da fonte externa é grátis?"]),
    yaml_order={
        "id_after": "has_api",
        "id_before": "requires_registration",
    },
)

REQUIRES_REGISTRATION_FIELD = Field(
    title="Requer registro",
    description=to_line(
        ["A fonte externa requer registro de usuário para acesso aos dados?"]
    ),
    yaml_order={
        "id_after": "is_free",
        "id_before": "availability",
    },
)

AVAILABILITY_FIELD = Field(
    title="Disponibilidade",
    description=to_line(["Como os dados são disponibilizados?"]),
    yaml_order={
        "id_after": "requires_registration",
        "id_before": "country_ip_address_required",
    },
)

COUNTRY_IP_ADDRESS_REQUIRED_FIELD = Field(
    title="Requer ip de algum país?",
    description=to_line([""]),
    yaml_order={
        "id_after": "availability",
        "id_before": "license",
    },
)

LICENSE_FIELD = Field(
    title="Tipo de licença de acesso",
    description=to_line(
        ["Qual tipo de licença regula acesso aos dados da fonte externa?"]
    ),
    yaml_order={
        "id_after": "country_ip_address_required",
        "id_before": "spatial_coverage",
    },
)

SPATIAL_COVERAGE_FIELD = Field(
    title="Cobertura espacial",
    description=to_line(["A máxima unidade espacial que a tabela cobre."]),
    yaml_order={
        "id_after": "license",
        "id_before": "temporal_coverage",
    },
)

TEMPORAL_COVERAGE_FIELD = Field(
    title="Cobertura temporal",
    description=to_line(["Anos cobertos pela tabela."]),
    yaml_order={
        "id_after": "spatial_coverage",
        "id_before": "update_frequency",
    },
)

UPDATE_FREQUENCY_FIELD = Field(
    title="Frequência de atualização",
    user_input_hint=["<frequência>"],
    description=to_line(["A unidade temporal pela qual a tabela é atualizada."]),
    yaml_order={
        "id_after": "temporal_coverage",
        "id_before": "entity",
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
    description=to_line(["A unidade temporal representada por cada linha."]),
    yaml_order={
        "id_after": "entity",
        "id_before": None,
    },
)
