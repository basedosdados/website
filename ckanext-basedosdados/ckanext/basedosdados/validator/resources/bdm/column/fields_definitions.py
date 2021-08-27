from typing import Optional

from ckanext.basedosdados.validator import BaseModel
from ckanext.basedosdados.validator.available_options import DirectoryEnum
from pydantic import Field
from pydantic import StrictStr as Str

to_line = lambda description: "\n".join(description)


class DirectoryColumn(BaseModel):
    dataset_id: Optional[DirectoryEnum] = Field(user_input_hint=["<dataset_id>"])
    table_id: Optional[Str] = Field(user_input_hint=["<table_id>"])
    column_name: Optional[Str] = Field(user_input_hint=["<column_name>"])


# -------------------------------------
# BdmColumns Fields
# -------------------------------------


NAME_FIELD = Field(
    title="Nome da coluna",
    description=to_line(
        [
            "Nome em produção",
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
            "Tipo no BigQuery. Ver https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types."
        ]
    ),
    yaml_order={
        "id_before": "name",
        "id_after": "description",
    },
)

DESCRIPTION_FIELD = Field(
    title="Descrição",
    description=to_line(["Descrição"]),
    yaml_order={
        "id_before": "bigquery_type",
        "id_after": "temporal_coverage",
    },
)

TEMPORAL_COVERAGE_FIELD = Field(
    title="Cobertura temporal",
    user_input_hint="<2001-2010>",
    description=to_line(["Anos cobertos pela tabela."]),
    yaml_order={
        "id_before": "description",
        "id_after": "covered_by_dictionary",
    },
)

COVERED_BY_DICTIONARY_FIELD = Field(
    title="Coberta por um dicionário",
    user_input_hint="<yes/no>",
    yaml_order={
        "id_before": "temporal_coverage",
        "id_after": "directory_column",
    },
)

DIRECTORY_COLUMN_FIELD = Field(
    title="Coluna correspondente nos diretórios",
    user_input_hint="<---->",
    yaml_order={
        "id_before": "covered_by_dictionary",
        "id_after": "measurement_unit",
    },
)

MEASUREMENT_UNIT_FIELD = Field(
    title="Unidade de medida",
    user_input_hint="<km/R$>",
    description=to_line(
        ["Qual é a unidade de medida da coluna? Ver ISO/IEC 80000 para notação padrão."]
    ),
    yaml_order={
        "id_before": "directory_column",
        "id_after": "has_sensitive_data",
    },
)

HAS_SENSITIVE_DATA_FIELD = Field(
    title="columns-has-sensitive-data",
    user_input_hint="<yes/no>",
    description=to_line(["[yes, no], se a coluna tem dados sensíveis."]),
    yaml_order={
        "id_before": "measurement_unit",
        "id_after": "is_in_staging",
    },
)

IS_IN_STAGING_FIELD = Field(
    title="columns-is_in_staging",
    user_input_hint=True,
    description=to_line(["Bool [True, False], se a coluna está na tabela staging"]),
    yaml_order={
        "id_before": "has_sensitive_data",
        "id_after": "is_partition",
    },
)

IS_PARTITION_FIELD = Field(
    title="columns-is_partition",
    user_input_hint=False,
    description=to_line(["Bool [True, False], se a coluna é uma partição."]),
    yaml_order={
        "id_before": "is_in_staging",
        "id_after": None,
    },
)

# DATASET_ID_FIELD = Field(
#     title="Dataset ID",
#     yaml_order={
#         "id_before": "is_partition",
#         "id_after": "table_id",
#     },
# )

# TABLE_ID_FIELD = Field(
#     title="Table ID",
#     yaml_order={
#         "id_before": "dataset_id",
#         "id_after": None,
#     },
# )
