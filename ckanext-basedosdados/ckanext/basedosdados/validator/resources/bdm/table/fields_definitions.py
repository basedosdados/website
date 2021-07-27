#!/usr/bin/env python3
from datetime import datetime
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
# BdmTable Custom Types
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

class LastUpdated(BaseModel):
    metadata: Optional[datetime] = Field(user_input_hint=["Última atualização: metadados"])
    data    : Optional[datetime] = Field(user_input_hint=["Última atualização: dados"])
    release : Optional[datetime] = Field(user_input_hint=["Último lançamento: dados originais"])

class PublishedBy(BaseModel):
    name   : Optional[Str] = Field(user_input_hint=["<nome [você]>"])
    email  : Optional[Str] = Field(user_input_hint=["<email>"])
    github : Optional[Str] = Field(user_input_hint=["<usuário Github>"])
    website: Optional[Str] = Field(user_input_hint=["<www.exemplo.com>"])

class DataCleanedBy(BaseModel):
    name    : Optional[Str] = Field(user_input_hint=["<nome>"])
    email   : Optional[Str] = Field(user_input_hint=["<email>"])
    github  : Optional[Str] = Field(user_input_hint=["<usuário Github>"])
    website : Optional[Str] = Field(user_input_hint=["<onde encontrar os dados tratados>"])
    code_url: Optional[Str] = Field(user_input_hint=["<onde encontrar código de limpeza>"])


to_line = lambda description: "\n".join(description)

# -------------------------------------
# BdmTable Fields
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
        "id_before": "description",
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
        "id_after": "table_id",
        "id_before": "spatial_coverage",
    },
)

SPATIAL_COVERAGE_FIELD = Field(
    title="Cobertura espacial",
    description=to_line(["A máxima unidade espacial que a tabela cobre."]),
    yaml_order={
        "id_after": "description",
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
    user_input_hint=["<unidade temporal>"],
    description=to_line(["A unidade temporal com qual a tabela é atualizada."]),
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
        "id_before": "identifying_columns",
    },
)

IDENTIFYING_COLUMNS_FIELD = Field(
    title="Colunas identificadoras",
    user_input_hint=["ex. id_municipio, produto, ano"],
    description=to_line(
        [
            "O conjunto mínimo de colunas identificando cada linha unicamente.",
            "Preencha com os nomes de colunas. Ex: id_municipio, ano.",
            "Pode ser vazio pois certas tabelas não possuem identificadores.",
        ]
    ),
    yaml_order={
        "id_after": "time_unit",
        "id_before": "last_updated",
    },
)

LAST_UPDATED_FIELD = Field(
    title="Última atualização",
    yaml_order={
        "id_after": "identifying_columns",
        "id_before": "version",
    },
)

VERSION_FIELD = Field(
    title="Versão",
    user_input_hint=["<vA.B>"],
    yaml_order={
        "id_after": "last_updated",
        "id_before": "published_by",
    },
)

# TODO: DICT TYPE
PUBLISHED_BY_FIELD = Field(
    title="Publicado por",
    description=to_line(["Quem está preenchendo esses metadados?"]),
    yaml_order={
        "id_after": "version",
        "id_before": "data_cleaned_by",
    },
)

# TODO: DICT TYPE
DATA_CLEANED_BY_FIELD = Field(
    title="Dados limpos por",
    description=to_line(
        [
            "Qual organização/departamento/pessoa tratou os dados?",
            "As vezes há um ponto intermediário entre os dados originais e subir na Base dos Dados.",
            "Se essa pessoa é você, preencha abaixo com suas informações.",
        ]
    ),
    yaml_order={
        "id_after": "published_by",
        "id_before": "data_cleaning_description",
    },
)

DATA_CLEANING_DESCRIPTION_FIELD = Field(
    title="Descrição da limpeza de dados",
    description=to_line(
        [
            "Se houve passos de tratamento, limpeza e manipulação de dados, descreva-os aqui."
        ]
    ),
    yaml_order={
        "id_after": "data_cleaned_by",
        "id_before": "raw_files_url",
    },
)

RAW_FILES_URL_FIELD = Field(
    title="Url dos dados originais",
    description=to_line(["Url dos dados originais no GCP Storage."]),
    yaml_order={
        "id_after": "data_cleaning_description",
        "id_before": "auxiliary_files_url",
    },
)

AUXILIARY_FILES_URL_FIELD = Field(
    title="Url dos arquivos auxiliares",
    description=to_line(["Url dos arquivos auxiliares no GCP Storage."]),
    yaml_order={
        "id_after": "raw_files_url",
        "id_before": "architecture_url",
    },
)

ARCHITECTURE_URL_FIELD = Field(
    title="Url da tabela de arquitetura",
    description=to_line(["Url da tabela de arquitetura no GCP Storage."]),
    yaml_order={
        "id_after": "auxiliary_files_url",
        "id_before": "covered_by_dictionary",
    },
)

COVERED_BY_DICTIONARY_FIELD = Field(
    title="Coberto por dicionário",
    yaml_order={
        "id_after": "architecture_url",
        "id_before": "source_bucket_name",
    },
)

SOURCE_BUCKET_NAME_FIELD = Field(
    title="Nome do bucket fonte no GCP",
    yaml_order={
        "id_after": "covered_by_dictionary",
        "id_before": "project_id_prod",
    },
)

PROJECT_ID_PROD_FIELD = Field(
    title="Project ID de produção no GCP",
    yaml_order={
        "id_after": "source_bucket_name",
        "id_before": "project_id_staging",
    },
)

PROJECT_ID_STAGING_FIELD = Field(
    title="Project ID de staging no GCP",
    yaml_order={
        "id_after": "project_id_prod",
        "id_before": "ckan_url",
    },
)

PARTITIONS_FIELD = Field(
    title="Partições",
    user_input_hint=["ex. ano, sigla_uf"],
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
    title="Tamanho do arquivo na nuvem",
    description=to_line([""]),
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


# =================================================================================================================================
# =================================================================================================================================
# =================================================================================================================================
# =================================================================================================================================
# =================================================================================================================================
# =================================================================================================================================
