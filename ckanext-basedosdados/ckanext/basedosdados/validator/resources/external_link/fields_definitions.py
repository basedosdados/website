from pydantic import Field

# -------------------------------------
# ExternalLink Custom Types
# -------------------------------------


# -------------------------------------
# ExternalLink Fields
# -------------------------------------
to_line = lambda description: "\n".join(description)

URL_FIELD = Field(
    title="Url",
    description=to_line(
        [
            "Url da fonte original.",
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
            "Um título descritivo.",
        ]
    ),
    yaml_order={
        "id_before": "url",
        "id_after": "description",
    },
)

DESCRIPTION_FIELD = Field(
    title="Descrição",
    description=to_line(
        [
            "Descreva a fonte externa. Essas são as primeiras frases que um usuário vai ver.",
            "Você não precisa ser muito conciso. Sinta-se a vontade para dar exemplos de",
            "como usar os dados.",
            "Se souber, liste também aplicações: pesquisa, apps, etc. que usem os dados.",
        ]
    ),
    yaml_order={
        "id_before": "title",
        "id_after": "language",
    },
)

LANGUAGE_FIELD = Field(
    title="Língua",
    description=to_line(
        [
            "Em quais línguas a fonte externa está disponível.",
            "Opções em 'language' em https://basedosdados.org/api/3/action/bd_available_options.",
        ]
    ),
    yaml_order={
        "id_before": "description",
        "id_after": "has_structure_data",
    },
)

HAS_STRUCTURED_DATA_FIELD = Field(
    title="Tem Dados Estruturados",
    description=to_line(
        [
            "A fonte externa disponibiliza dados em formatos estruturados, como csv, json, etc?",
            "Opções: yes, no.",
        ]
    ),
    yaml_order={
        "id_before": "language",
        "id_after": "has_api",
    },
)

HAS_API_FIELD = Field(
    title="Tem uma API",
    description=to_line(
        [
            "A fonte externa disponibiliza uma API para acesso aos dados?",
            "Opções: yes, no.",
        ]
    ),
    yaml_order={
        "id_before": "has_structured_data",
        "id_after": "is_free",
    },
)

IS_FREE_FIELD = Field(
    title="É de Graça",
    description=to_line(
        ["O acesso aos dados da fonte externa é grátis?", "Opções: yes, no."]
    ),
    yaml_order={
        "id_before": "has_api",
        "id_after": "requires_registration",
    },
)

REQUIRES_REGISTRATION_FIELD = Field(
    title="Requer Registro",
    description=to_line(
        [
            "A fonte externa requer registro de usuário para acesso aos dados?",
            "Opções: yes, no.",
        ]
    ),
    yaml_order={
        "id_before": "is_free",
        "id_after": "availability",
    },
)

AVAILABILITY_FIELD = Field(
    title="Disponibilidade",
    description=to_line(
        [
            "Como os dados são disponibilizados?",
            "Opções 'availability' em https://basedosdados.org/api/3/action/bd_available_options.",
        ]
    ),
    default="online",
    yaml_order={
        "id_before": "requires_registration",
        "id_after": "country_ip_address_required",
    },
)

COUNTRY_IP_ADDRESS_REQUIRED_FIELD = Field(
    title="Requer IP de Algum País",
    description=to_line(
        [
            "Países nos quais o acesso à fonte externa é liberado.",
            "Opções em 'country' em https://basedosdados.org/api/3/action/bd_available_options.",
        ]
    ),
    yaml_order={
        "id_before": "availability",
        "id_after": "license",
    },
)

LICENSE_FIELD = Field(
    title="Tipo de Licença",
    description=to_line(
        ["Qual tipo de licença regula acesso aos dados da fonte externa?"]
    ),
    yaml_order={
        "id_before": "country_ip_address_required",
        "id_after": "spatial_coverage",
    },
)

SPATIAL_COVERAGE_FIELD = Field(
    title="Cobertura Espacial",
    description=to_line(["A máxima unidade espacial que a tabela cobre."]),
    yaml_order={
        "id_before": "license",
        "id_after": "temporal_coverage",
    },
)

TEMPORAL_COVERAGE_FIELD = Field(
    title="Cobertura Temporal",
    description=to_line(
        [
            "Anos cobertos pela tabela.",
            "Preencher como lista de intervalos.",
            "Exemplos: 1995(1)2018 ou (1)2020.",
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
            "A unidade temporal pela qual a tabela é atualizada.",
            "Opções em 'time_unit' em https://basedosdados.org/api/3/action/bd_available_options.",
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
            "Nível de observação dos dados: o que representa cada linha.",
        ]
    ),
    yaml_order={
        "id_before": "update_frequency",
        "id_after": None,
    },
)
