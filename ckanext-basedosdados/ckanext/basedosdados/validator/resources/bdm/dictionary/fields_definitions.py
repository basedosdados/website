#!/usr/bin/env python3
from pydantic import Field

# -------------------------------------
# BdmDictionary Custom Types
# -------------------------------------


# -------------------------------------
# BdmDictionary Fields
# -------------------------------------
to_line = lambda description: "\n".join(description)

DATASET_ID_FIELD = Field(
    title="ID Conjunto",
    yaml_order={
        "id_after": None,
        "id_before": "table_id",
    },
)

TABLE_ID_FIELD = Field(
    title="ID Tabela",
    yaml_order={
        "id_after": "dataset_id",
        "id_before": "identifying_columns",
    },
)

IDENTIFYING_COLUMNS_FIELD = Field(
    title="Colunas Identificadoras",
    user_input_hint=["<primeira coluna>"],
    description=to_line(
        [
            "O conjunto mínimo de colunas identificando cada linha unicamente.",
            "Preencha com os nomes de colunas. Ex: id_municipio, ano.",
            "Pode ser vazio pois certas tabelas não possuem identificadores.",
        ]
    ),
    yaml_order={
        "id_after": "table_id",
        "id_before": "last_updated",
    },
)

LAST_UPDATED_FIELD = Field(
    title="Data da Última Atualização",
    yaml_order={
        "id_after": "identifying_columns",
        "id_before": "published_by",
    },
)

# TODO: DICT TYPE
PUBLISHED_BY_FIELD = Field(
    title="Publicado por",
    description=to_line(["Quem está preenchendo esses metadados?"]),
    yaml_order={
        "id_after": "last_updated",
        "id_before": "source_bucket_name",
    },
)

SOURCE_BUCKET_NAME_FIELD = Field(
    title="Nome do Bucket Fonte no GCP",
    yaml_order={
        "id_after": "published_by",
        "id_before": "project_id_prod",
    },
)

PROJECT_ID_PROD_FIELD = Field(
    title="ID do Projeto de Produção no GCP",
    yaml_order={
        "id_after": "source_bucket_name",
        "id_before": "project_id_staging",
    },
)

PROJECT_ID_STAGING_FIELD = Field(
    title="ID do Projeto de Staging no GCP",
    yaml_order={
        "id_after": "project_id_prod",
        "id_before": "ckan_url",
    },
)

PARTITIONS_FIELD = Field(
    title="Partições",
    user_input_hint=["<primeira partição>"],
    description=to_line(
        [
            "Liste as colunas da tabela que representam partições.",
            "Não esqueça de deletar essas colunas nas tabelas .csv na hora de subir para o BigQuery.",
            "Isso poupará muito tempo e dinheiro às pessoas utilizando essa tabela.",
            "Se não houver partições, não modifique abaixo.",
        ]
    ),
    yaml_order={
        "id_after": "github_url",
        "id_before": "bdm_file_size",
    },
)

BDM_FILE_SIZE_FIELD = Field(
    title="Tamanho do Arquivo",
    description=to_line([""]),
    user_input_hint=["<>"],
    yaml_order={
        "id_after": "partitions",
        "id_before": "columns",
    },
)

COLUMNS_FIELD = Field(
    title="Colunas",
    description=to_line(
        [
            "Quais são as colunas? Certifique-se de escrever uma boa descrição, as pessoas vão gostar",
            "para saber sobre o que é a coluna.",
            "Adicionar todas as colunas manualmente pode ser bastante cansativo, por isso, quando",
            "inicializando este arquivo de configuração, você pode apontar a função para uma amostra de dados que",
            "preencherá automaticamente as colunas.",
            "Algumas colunas existirão apenas na tabela final, você as construirá em `publish.sql`.",
            "Para esses, defina is_in_staging como False.",
            "Além disso, você deve adicionar as colunas de partição aqui e definir is_partition como True.",
        ]
    ),
    yaml_order={
        "id_after": "bdm_file_size",
        "id_before": None,
    },
)
