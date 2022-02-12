#!/usr/bin/env python3
from pydantic import Field

# -------------------------------------
# Dataset Custom Types
# -------------------------------------


# -------------------------------------
# Dataset Fields
# -------------------------------------
to_line = lambda description: "\n".join(description)

NAME_FIELD = Field(
    title="Nome",
    description=to_line(
        [
            "Nome (slug) do conjunto no CKAN",
            "Exemplos: br-ibge-populacao, br-tse-eleicoes"
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
        "id_before": "name",
        "id_after": "organization",
    },
)

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
        "id_before": "title",
        "id_after": "notes",
    },
)

NOTES_FIELD = Field(
    title="Descrição",
    description="Descrição do conjunto",
    yaml_order={
        "id_before": "organization",
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
        "id_before": "notes",
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
        "id_before": "tags",
        "id_after": None,
    },
)


AUTHOR_FIELD = Field(
    title="Autor(a)",
    description=to_line(
        [
            "Qual departamento/grupo/pessoa mantém os dados originais?"
        ]
    ),
)

SHORT_DESCRIPTION_FIELD = Field(
    title="Descrição curta",
    description=to_line(
        [
            "Descrição curta (até 280 caracteres) do conjunto."
        ]
    ),
)

DESCRIPTION_FIELD = Field(
    title="Descrição",
    description=to_line(
        [
            "Descrição do conjunto."
        ]
    ),
)

CKAN_URL_FIELD = Field(
    title="Url CKAN",
    description=to_line(
        [
            "Url completa do CKAN já contendo o dataset-id",
            "Exemplo: https://basedosdados.org/dataset/<dataset-id>"
        ]   
    ),
)

GITHUB_URL_FIELD = Field(
    title="Url Github",
    description=to_line(
        [
            "Url completa do Github já contendo o dataset_id",
            "Exemplo: https://github.com/basedosdados/mais/tree/master/bases/<dataset_id>"
        ]
    ),
)
