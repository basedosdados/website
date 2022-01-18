#!/usr/bin/env python3
from pydantic import Field

# -------------------------------------
# Dataset Custom Types
# -------------------------------------


# -------------------------------------
# Dataset Fields
# -------------------------------------
to_line = lambda description: "\n".join(description)

ORGANIZATION_FIELD = Field(
    title="ID Organização",
    description=to_line(
        [
            "Qual organização disponibiliza os dados originais?",
            "Opções: escolher dessa lista -> https://basedosdados.org/api/3/action/organization_list",
            "Exemplos: br-ibge, br-tse, br-rj-gov"
        ]
    ),
    yaml_order={
        "id_before": None,
        "id_after": "title",
    },
)

TITLE_FIELD = Field(
    title="Título",
    description=to_line(
        [
            "Título do conjunto, a ser exibido no mecanismo de busca.",
            "Exemplo: População brasileira"
        ],
    ),
    yaml_order={
        "id_before": "organization",
        "id_after": "description",
    },
)

DESCRIPTION_FIELD = Field(
    title="Descrição",
    description=to_line(
        [
            "Descrição e anotações úteis sobre os dados."
        ]
    ),
    yaml_order={
        "id_before": "title",
        "id_after": "groups",
    },
)

GROUPS_FIELD = Field(
    title="Temas",
    description=to_line(
        [
            "Quais temas caracterizam a base?",
            "Opções: escolher dessa lista -> https://basedosdados.org/api/3/action/group_list",
            "Importante: preencher com a chave, e não o valor."
        ]
    ),
    yaml_order={
        "id_before": "description",
        "id_after": "tags",
    },
)

TAGS_FIELD = Field(
    title="Etiquetas",
    description=to_line(
        [
            "Quais etiquetas caracterizam a base?",
            "Opções: escolher dessa lista -> https://basedosdados.org/api/3/action/tag_list",
            "Exemplos: fertilidade, preco, desmatamento.",
            "Caso crie etiquetas novas, as regras são:",
            "   - letras minúsculas",
            "   - sem acentos",
            "   - sempre no singular",
            "   - não repita nomes de grupos (ex. educacao, saude, meio ambiente, economia, etc.)",
        ]
    ),
    yaml_order={
        "id_before": "groups",
        "id_after": "ckan_url",
    },
)

CKAN_URL_FIELD = Field(
    title="Url CKAN",
    description=to_line(
        [
            "Url completa do CKAN já contendo o dataset-id",
            "Exemplo: https://basedosdados.org/dataset/<dataset-id>"
        ]   
    ),
    yaml_order={
        "id_before": "tags",
        "id_after": "github_url",
    },
)

GITHUB_URL_FIELD = Field(
    title="Url Github",
    description=to_line(
        [
            "Url completa do Github já contendo o dataset_id",
            "Exemplo: https://github.com/basedosdados/mais/tree/master/bases/<dataset_id>"
        ]
    ),
    yaml_order={
        "id_before": "ckan_url",
        "id_after": "metadata_modified",
    },
)

METADATA_MODIFIED_FIELD = Field(
    title="Data de Modificação",
    description=to_line(
        [
            "Não altere esse campo.",
            "Data da última modificação dos metadados gerada automaticamente pelo CKAN."
        ]
    ),
    yaml_order={
        "id_before": "github_url",
        "id_after": None,
    },
)

VISIBILITY_FIELD = Field(title="Visibilidade")

AUTHOR_FIELD = Field(
    title="Autor(a)",
    description=to_line(
        [
            "Qual departamento/grupo/pessoa mantém os dados originais?"
        ]
    ),
)
