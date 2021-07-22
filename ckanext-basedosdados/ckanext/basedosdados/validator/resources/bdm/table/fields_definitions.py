#!/usr/bin/env python3
from datetime import datetime
from pydantic import (
    StrictStr as Str,
    Field,
)
from ckanext.basedosdados.validator import BaseModel


class PublishedBy(BaseModel):
    name: Str = Field(user_input_hint=["<nome [você]>"])
    email: Str = Field(user_input_hint=["<email>"])
    github: Str = Field(user_input_hint=["<Github user>"])
    website: Str = Field(user_input_hint=["<www.exemplo.com>"])


class DataCleanedBy(BaseModel):
    name: Str = Field(user_input_hint=["<nome>"])
    code_url: Str = Field(user_input_hint=["<onde encontrar código de limpeza>"])
    website: Str = Field(user_input_hint=["<onde encontrar os dados tratados>"])
    email: Str = Field(user_input_hint=["<email>"])


class LastUpdated(BaseModel):
    metadata: datetime = Field(user_input_hint=["Última atualização: metadados"])
    data: datetime = Field(user_input_hint=["Última atualização: metadados"])
    release: datetime = Field(user_input_hint=["Último lançamento: dados originais"])


to_line = lambda description: "\n".join(description)

# -------------------------------------
# BdmTable Fields
# -------------------------------------

METADATA_MODIFIED_FIELD = Field(
    title="metadata_modified",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

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
        "id_before": "",
        "id_after": "",
    },
)


SPATIAL_COVERAGE_FIELD = Field(
    title="Cobertura espacial",
    description=to_line(["A máxima unidade espacial que a tabela cobre."]),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


TEMPORAL_COVERAGE_FIELD = Field(
    title="Cobertura temporal",
    description=to_line(["Anos cobertos pela tabela."]),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


UPDATE_FREQUENCY_FIELD = Field(
    title="Frequência de atualização",
    user_input_hint=["<frequência>"],
    description=to_line(
        [
            "A unidade temporal pela qual a tabela é atualizada.",
            "Opções: hora | dia | semana | mes | 1 ano | 2 anos | 5 anos | 10 anos | unico | recorrente",
        ]
    ),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


OBSERVATION_LEVEL_FIELD = Field(
    title="Entidade",
    description=to_line(
        [
            "Nível da observação (qual é a granularidade de cada linha na tabela)",
            "Escolha todas as opções necessárias.",
            "Regras:",
            "  - minúsculo, sem acento, singular.",
            "  - em portugues (ou seja, não use os nomes de colunas abaixo)",
            "Exemplos: pais, estado, municipio, cidade, hora, dia, semana, mes, ano, etc.",
        ]
    ),
    max_items=10,
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


TIME_UNIT_FIELD = Field(
    title="Unidade temporal",
    description=to_line(
        [
            "A unidade temporal representada por cada linha.",
            "Opções: hora | dia | semana | mes | 1 ano | 2 anos | 5 anos | 10 anos | unico | recorrente",
        ]
    ),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

IDENTIFYING_COLUMNS_FIELD = Field(
    title="Colunas identificadoras",
    user_input_hint=["<primeira coluna>"],
    description=to_line(
        [
            "O conjunto mínimo de colunas identificando cada linha unicamente.",
            "Preencha com os nomes de colunas. Ex: id_municipio, ano.",
            "Pode ser vazio pois certas tabelas não possuem identificadores.",
        ]
    ),
    yaml_order={
        "id_before": "observation_level",
        "id_after": "spatial_coverage",
    },
)

LAST_UPDATED_FIELD = Field(
    title="Última atualização",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

VERSION_FIELD = Field(
    title="Versão",
    user_input_hint=["<vA.B>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


# TODO: DITC TYPE
PUBLISHED_BY_FIELD = Field(
    title="Publicado por",
    description=to_line(["Quem está completando esse arquivo config?"]),
    yaml_order={
        "id_before": "",
        "id_after": "",
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
        "id_before": "",
        "id_after": "",
    },
)

RAW_URL_FIELD = Field(
    title="Url dos dados originais",
    description=to_line(["Url dos dados originais"]),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

AUXILIARY_FILES_URL_FIELD = Field(
    title="Url dos arquivos auxiliares",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

ARCHITECTURE_URL_FIELD = Field(
    title="Url da tabela de arquitetura",
    description=to_line(["Url da tabela de arquitetura"]),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

COVERED_BY_DICTIONARY_FIELD = Field(
    title="Coberto por dicionário",
    user_input_hint=["<Sim/Não>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


DATA_CLEANED_BY_FIELD = Field(
    title="Dados limpos por",
    user_input_hint=["<nome>"],
    description=to_line(
        [
            "Qual organização/departamento/pessoa tratou os dados?",
            "As vezes há um ponto intermediário entre os dados originais e subir na Base dos Dados.",
            "Se essa pessoa é você, preencha abaixo com suas informações.",
        ]
    ),
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


SOURCE_BUCKET_NAME_FIELD = Field(
    title="source_bucket_name",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


PROJECT_ID_STAGING_FIELD = Field(
    title="project_id_staging",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

PROJECT_ID_PROD_FIELD = Field(
    title="project_id_prod",
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)

# TODO: remove this field?
URL_CKAN_FIELD = Field(
    title="url_ckan",
    user_input_hint=["<https://basedosdados.org/dataset/<dataset_id>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


URL_GITHUB_FIELD: Str = Field(
    title="url_github",
    user_input_hint=[
        "<https://github.com/basedosdados/mais/tree/master/bases/<dataset_id>"
    ],
    yaml_order={
        "id_before": "",
        "id_after": "",
    },
)


PARTITIONS_FIELD = Field(
    title="partitions",
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
        "id_before": "",
        "id_after": "",
    },
)

BDM_FILE_SIZE_FIELD = Field(
    title="",
    description=to_line([""]),
    user_input_hint=["<>"],
    yaml_order={
        "id_before": "",
        "id_after": "",
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
)


# =================================================================================================================================
# =================================================================================================================================
# =================================================================================================================================
# =================================================================================================================================
# =================================================================================================================================
# =================================================================================================================================
