from pydantic import Field

to_line = lambda description: "\n".join(description)


# -------------------------------------
# BdmColumns Fields
# -------------------------------------
DATASET_ID_FIELD = Field(
    title="Dataset ID",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

TABLE_ID_FIELD = Field(
    title="Table ID",
    yaml_order={
        "id_before": "dataset_id",
        "id_after": "source_bucket_name",
    },
)


NAME_FIELD = Field(
    title="Nome da coluna",
    description=to_line(
        [
            "Nome da coluna",
        ]
    ),
)


BIGQUERY_TYPE_FIELD = Field(
    title="Tipo no BigQuery",
    description=to_line(
        [
            "Tipo da coluna no BigQuery. Ver https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types."
        ]
    ),
)


DESCRIPTION_FIELD = Field(
    title="Descrição",
    description=to_line(
        [
            "Descrição da coluna",
        ]
    ),
)

TEMPORAL_COVERAGE_FIELD = Field(
    title="Cobertura temporal",
    description=to_line(["Anos cobertos pela tabela."]),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


COVERED_BY_DICTIONARY_FIELD = Field(
    title="Tem dicionário?",
    user_input_hint=["<Sim/Não>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


DIRECTORY_COLUMN_FIELD = Field(
    title="Coberto por dicionário",
    user_input_hint=["<Sim/Não>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

MEASUREMENT_UNIT_FIELD = Field(
    title="Unidade de medida",
    description=to_line(
        ["Qual é a unidade de medida da coluna? Ver ISO/IEC 80000 para notação padrão."]
    ),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

ORIGINAL_NAMES_FIELD = Field(
    title="Nomes original",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


IS_IN_STAGING_FIELD = Field(
    title="columns-is_in_staging",
    user_input_hint=["<True/False>"],
    description=to_line(
        [
            "Bool [True, False], se a coluna está na tabela staging",
        ]
    ),
)

IS_PARTITION_FIELD = Field(
    title="columns-is_partition",
    user_input_hint=["<True/False>"],
    description=to_line(
        [
            "Bool [True, False], se a coluna é uma partição.",
        ]
    ),
)
