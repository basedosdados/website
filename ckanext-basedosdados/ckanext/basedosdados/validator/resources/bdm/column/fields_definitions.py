from typing import Optional

from ckanext.basedosdados.validator import BaseModel
from ckanext.basedosdados.validator.available_options import DirectoryEnum
from pydantic import Field
from pydantic import StrictStr as Str

to_line = lambda description: "\n".join(description)

# -------------------------------------
# BdmColumns Custom Types
# -------------------------------------


class DirectoryColumn(BaseModel):
    # fmt: off
    dataset_id : Optional[DirectoryEnum] = Field(title="ID Conjunto",description=to_line(["<dataset_id>"]))
    table_id   : Optional[Str]           = Field(title="ID Tabela",description=to_line(["<table_id>"]))
    column_name: Optional[Str]           = Field(title="Nome Coluna",description=to_line(["<column_name>"]))
    # fmt: on


# -------------------------------------
# BdmColumns Fields
# -------------------------------------

NAME_FIELD = Field(
    title="Nome",
    description=to_line(
        [
            "Nome em produção"
        ]
    ),
    yaml_order={
        "id_before": None,
        "id_after": "bigquery_type",
    },
)

BIGQUERY_TYPE_FIELD = Field(
    title="Tipo no BigQuery",
    description=to_line(
        [
            "Tipo no BigQuery.",
            "Opções: string, int64, float64, date, time, geometry."
            "Ver https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types."
        ]
    ),
    yaml_order={
        "id_before": "name",
        "id_after": "description",
    },
)

DESCRIPTION_FIELD = Field(
    title="Descrição",
    description=to_line(
        [
            "Descrição"
        ]
    ),
    yaml_order={
        "id_before": "bigquery_type",
        "id_after": "temporal_coverage",
    },
)

TEMPORAL_COVERAGE_FIELD = Field(
    title="Cobertura Temporal",
    description=to_line(
        [
            "Anos cobertos pela tabela.",
            "Preenchido como lista de intervalos sem repetir os metadados da tabela."
            "Exemplo: 2001(1)2010, ou (1)2020, ou (1)."
        ]
    ),
    yaml_order={
        "id_before": "description",
        "id_after": "covered_by_dictionary",
    },
)

COVERED_BY_DICTIONARY_FIELD = Field(
    title="Coberta por um Dicionário",
    description=to_line(
        [
            "A coluna precisa de dicionário?",
            "Opções: yes, no."
        ]
    ),
    default="no",
    yaml_order={
        "id_before": "temporal_coverage",
        "id_after": "directory_column",
    },
)

DIRECTORY_COLUMN_FIELD = Field(
    title="Coluna Correspondente nos Diretórios",
    description=to_line(
        [
            "Chave primária nos diretórios correspondente à coluna."
        ]
    ),
    yaml_order={
        "id_before": "covered_by_dictionary",
        "id_after": "measurement_unit",
    },
)

MEASUREMENT_UNIT_FIELD = Field(
    title="Unidade de Medida",
    description=to_line(
        [
            "Qual é a unidade de medida da coluna?"
            "Opções: ver elementos em 'Measurement Unit' em https://basedosdados.org/api/3/action/bd_available_options."
        ]
    ),
    yaml_order={
        "id_before": "directory_column",
        "id_after": "has_sensitive_data",
    },
)

HAS_SENSITIVE_DATA_FIELD = Field(
    title="Contém Dados Sensíveis (LGPD)",
    description=to_line(
        [
            "A coluna contém dados sensíveis, como definido pela Lei Geral de Proteção de Dados (LGPD)?",
            "Opções: yes, no."
        ]
    ),
    default="no",
    yaml_order={
        "id_before": "measurement_unit",
        "id_after": "observations",
    },
)

OBSERVATIONS_FIELD = Field(
    title="Observações",
    description=to_line(
        [
            "Informações sobre a coluna: arquitetura, decisões de limpeza, etc.",
        ]
    ),
    yaml_order={
        "id_before": "has_sensitive_data",
        "id_after": "is_in_staging",
    },
)

IS_IN_STAGING_FIELD = Field(
    title="Está em Staging",
    description=to_line(
        [
            "A coluna está na tabela staging?",
            "Opções: True, False"
        ]
    ),
    default=True,
    yaml_order={
        "id_before": "observations",
        "id_after": "is_partition",
    },
)

IS_PARTITION_FIELD = Field(
    title="É Partição",
    description=to_line(
        [
            "A coluna é uma partição?",
            "Opções: True, False"
        ]
    ),
    default=False,
    yaml_order={
        "id_before": "is_in_staging",
        "id_after": None,
    },
)
