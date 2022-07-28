#!/usr/bin/env python3
from typing import Optional

from ckanext.basedosdados.validator import BaseModel
from pydantic import Field
from pydantic import StrictStr as Str

# -------------------------------------
# BdmTable Custom Types
# -------------------------------------

to_line = lambda description: "\n".join(description)


class DataCleanedBy(BaseModel):
    # fmt: off
    name        : Optional[Str] = Field(title="Nome")
    email       : Optional[Str] = Field(title="Email")
    github_user : Optional[Str] = Field(title="Usuário Github")
    ckan_user   : Optional[Str] = Field(title="Usuário CKAN")
    website     : Optional[Str] = Field(title="Website")
    # fmt: on


# -------------------------------------
# BdmTable Fields
# -------------------------------------

DATASET_ID_FIELD = Field(
    title="ID Conjunto",
    description=to_line(
        [
            "Igual ao dataset.name mas como lower case.",
            "Exemplos: br_ibge_populacao, br_inep_censo_escolar",
        ]
    ),
    yaml_order={
        "id_before": None,
        "id_after": "table_id",
    },
)

TABLE_ID_FIELD = Field(
    title="ID Tabela",
    yaml_order={
        "id_before": "dataset_id",
        "id_after": "title",
    },
)

TITLE_FIELD = Field(
    title="Título",
    description=to_line(["Título da tabela."]),
    yaml_order={
        "id_before": "table_id",
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
        "id_before": "title",
        "id_after": "spatial_coverage",
    },
)

SPATIAL_COVERAGE_FIELD = Field(
    title="Cobertura Espacial",
    description=to_line(
        [
            "As máximas unidades espaciais que a tabela cobre.",
            "Exemplo:",
            "  - sa.br",
        ]
    ),
    yaml_order={
        "id_before": "description",
        "id_after": "temporal_coverage",
    },
)

TEMPORAL_COVERAGE_FIELD = Field(
    title="Cobertura Temporal",
    description=to_line(
        [
            "Anos cobertos pela tabela.",
            "Preencher como lista de intervalos.",
            "Exemplos: ['1995(1)2019'], ['2002(2)2010', '2016', '2020'].",
        ]
    ),
    yaml_order={
        "id_before": "spatial_coverage",
        "id_after": "update_frequency",
    },
)

UPDATE_FREQUENCY_FIELD = Field(
    title="Frequência de Atualização",
    description=to_line(
        [
            "A unidade temporal com qual a tabela é atualizada.",
            "Opções em 'https://basedosdados.org/api/3/action/bd_available_options'",
        ]
    ),
    yaml_order={
        "id_before": "temporal_coverage",
        "id_after": "observation_level",
    },
)

OBSERVATION_LEVEL_FIELD = Field(
    title="Nível da observação",
    description=to_line(
        [
            "Nível de observação da tabela: o que representa cada linha.",
        ]
    ),
    yaml_order={
        "id_before": "update_frequency",
        "id_after": "last_updated",
    },
)

LAST_UPDATED_FIELD = Field(
    title="Data da Última Atualização",
    yaml_order={
        "id_before": "observation_level",
        "id_after": "version",
    },
)

VERSION_FIELD = Field(
    title="Versão",
    description=to_line(
        [
            "Versão da tabela. Seguindo o padrão de semantic versioning.",
            "Exemplo: v1.1.3",
        ]
    ),
    yaml_order={
        "id_before": "last_updated",
        "id_after": "published_by",
    },
)

PUBLISHED_BY_FIELD = Field(
    title="Publicado por",
    description=to_line(["Quem está preenchendo esses metadados?"]),
    yaml_order={
        "id_before": "version",
        "id_after": "data_cleaned_by",
    },
)

DATA_CLEANED_BY_FIELD = Field(
    title="Dados Limpos por",
    description=to_line(
        [
            "Qual organização/departamento/pessoa tratou os dados?",
            "As vezes há um ponto intermediário entre os dados originais e subir na Base dos Dados.",
            "Se essa pessoa é você, preencha abaixo com suas informações.",
        ]
    ),
    yaml_order={
        "id_before": "published_by",
        "id_after": "data_cleaning_description",
    },
)

DATA_CLEANING_DESCRIPTION_FIELD = Field(
    title="Descrição da Limpeza de Dados",
    description=to_line(
        [
            "Se houve passos de tratamento, limpeza e manipulação de dados, descreva-os aqui."
        ]
    ),
    yaml_order={
        "id_before": "data_cleaned_by",
        "id_after": "data_cleaning_code_url",
    },
)

DATA_CLEANING_CODE_URL_FIELD = Field(
    title="Url do Código de Limpeza dos Dados",
    description=to_line(["Url do código de limpeza dos dados."]),
    yaml_order={
        "id_before": "data_cleaning_description",
        "id_after": "partner_organization",
    },
)

PARTNER_ORGANIZATION_FIELD = Field(
    title="Organização parceira",
    description=to_line(
        ["Organização que ajudou institucionalmente na disponibilização dos dados."]
    ),
    yaml_order={
        "id_before": "data_cleaning_code_url",
        "id_after": "raw_files_url",
    },
)

RAW_FILES_URL_FIELD = Field(
    title="Url dos Dados Originais",
    description=to_line(["Url dos dados originais no GCP Storage."]),
    yaml_order={
        "id_before": "partner_organization",
        "id_after": "auxiliary_files_url",
    },
)

AUXILIARY_FILES_URL_FIELD = Field(
    title="Url dos Arquivos Auxiliares",
    description=to_line(["Url dos arquivos auxiliares no GCP Storage."]),
    yaml_order={
        "id_before": "raw_files_url",
        "id_after": "architecture_url",
    },
)

ARCHITECTURE_URL_FIELD = Field(
    title="Url da Tabela de Arquitetura",
    description=to_line(["Url da tabela de arquitetura no GCP Storage."]),
    yaml_order={
        "id_before": "auxiliary_files_url",
        "id_after": "source_bucket_name",
    },
)

SOURCE_BUCKET_NAME_FIELD = Field(
    title="Nome do Bucket Fonte no GCP",
    yaml_order={
        "id_before": "architecture_url",
        "id_after": "project_id_prod",
    },
)

PROJECT_ID_PROD_FIELD = Field(
    title="ID do Projeto de Produção no GCP",
    yaml_order={
        "id_before": "source_bucket_name",
        "id_after": "project_id_staging",
    },
)

PROJECT_ID_STAGING_FIELD = Field(
    title="ID do Projeto de Staging no GCP",
    yaml_order={
        "id_before": "project_id_prod",
        "id_after": "partitions",
    },
)

PARTITIONS_FIELD = Field(
    title="Partições",
    description=to_line(
        [
            "Liste as colunas da tabela que representam partições.",
            "Não esqueça de deletar essas colunas nas tabelas .csv na hora de subir para o BigQuery.",
            "Isso poupará muito tempo e dinheiro às pessoas utilizando essa tabela.",
            "Se não houver partições, não modifique abaixo.",
        ]
    ),
    yaml_order={
        "id_before": "project_id_staging",
        "id_after": "columns",
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
        "id_before": "partitions",
        "id_after": "number_rows",
    },
)

NUMBER_ROWS_FIELD = Field(
    title="Número de Linhas da Tabela",
    yaml_order={
        "id_before": "columns",
        "id_after": "metadata_modified",
    },
)

METADATA_MODIFIED_FIELD = Field(
    title="Data da Última Modificação dos Metadados",
    yaml_order={
        "id_before": "number_rows",
        "id_after": None,
    },
)

UNCOMPRESSED_FILE_SIZE_FIELD = Field(
    title="Tamanho do Arquivo Não-Comprimido (em bytes)",
    description=to_line([""]),
)

COMPRESSED_FILE_SIZE_FIELD = Field(
    title="Tamanho do Arquivo Comprimido (em bytes)",
    description=to_line([""]),
)
