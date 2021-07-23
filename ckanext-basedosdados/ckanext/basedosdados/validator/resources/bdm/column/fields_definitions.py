from pydantic import Field

to_line = lambda description: "\n".join(description)


# -------------------------------------
# BdmColumns Fields
# -------------------------------------

DATASET_ID_FIELD = Field(
    title="Dataset ID",
    yaml_order={
        "id_after": None,
        "id_before": "table_id",
    },
)

TABLE_ID_FIELD = Field(
    title="Table ID",
    yaml_order={
        "id_after": "dataset_id",
        "id_before": "name",
    },
)

NAME_FIELD = Field(
    title="Nome da coluna",
    description=to_line(["Nome em produção",]),
    yaml_order={
        "id_after": "table_id",
        "id_before": "bigquery_type",
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
        "id_after": "name",
        "id_before": "description",
    },
)

DESCRIPTION_FIELD = Field(
    title="Descrição",
    description=to_line(["Descrição"]),
    yaml_order={
        "id_after": "bigquery_type",
        "id_before": "temporal_coverage",
    },
)

TEMPORAL_COVERAGE_FIELD = Field(
    title="Cobertura temporal",
    description=to_line(["Anos cobertos pela tabela."]),
    yaml_order={
        "id_after": "description",
        "id_before": "covered_by_dictionary",
    },
)

COVERED_BY_DICTIONARY_FIELD = Field(
    title="Coberta por um dicionário",
    yaml_order={
        "id_after": "temporal_coverage",
        "id_before": "directory_column",
    },
)

DIRECTORY_COLUMN_FIELD = Field(
    title="Coluna correspondente nos diretórios",
    yaml_order={
        "id_after": "covered_by_dictionary",
        "id_before": "measurement_unit",
    },
)

MEASUREMENT_UNIT_FIELD = Field(
    title="Unidade de medida",
    description=to_line(
        ["Qual é a unidade de medida da coluna? Ver ISO/IEC 80000 para notação padrão."]
    ),
    yaml_order={
        "id_after": "directory_column",
        "id_before": "original_names",
    },
)

ORIGINAL_NAMES_FIELD = Field(
    title="Nomes originais",
    yaml_order={
        "id_before": "measurement_unit",
        "id_after": "is_in_staging",
    },
)

IS_IN_STAGING_FIELD = Field(
    title="columns-is_in_staging",
    user_input_hint=["<True/False>"],
    description=to_line(["Bool [True, False], se a coluna está na tabela staging"]),
    yaml_order={
        "id_after": "original_names",
        "id_before": "is_partition",
    },
)

IS_PARTITION_FIELD = Field(
    title="columns-is_partition",
    user_input_hint=["<True/False>"],
    description=to_line(["Bool [True, False], se a coluna é uma partição."]),
    yaml_order={
        "id_after": "is_in_staging",
        "id_before": None,
    },
)
