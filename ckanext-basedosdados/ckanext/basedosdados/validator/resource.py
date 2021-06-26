import datetime
from typing_extensions import Annotated

from . import BaseModel, treat_scalar_as_single_value_set
from enum import Enum
from typing import List, Optional, Literal, Union, Set
from pydantic import (
    StrictInt as Int,
    StrictStr as Str,
    Field,
    ValidationError,
    validator,
)
from .data_types import ObservationLevel, TemporalCoverage, IdType
from .data_types.attr_enum import AttrEnum

YES_NO = Literal["yes", "no"]

F = Field


class UpdateFrequencyEnum(AttrEnum):
    second = {"label": "Second"}
    minute = {"label": "Minute"}
    hour = {"label": "Hour"}
    day = {"label": "Day"}
    week = {"label": "Week"}
    month = {"label": "Month"}
    quarter = {"label": "Quarter"}
    semester = {"label": "Semester"}
    one_year = {"label": "One Year"}
    two_years = {"label": "Two Years"}
    three_years = {"label": "Three Years"}
    four_years = {"label": "Four Years"}
    five_years = {"label": "Five Years"}
    ten_years = {"label": "Ten Years"}
    unique = {"label": "Unique"}
    recurring = {"label": "Recurring"}
    empty = {"label": "Empty"}
    other = {"label": "Other"}


class LanguageEnum(AttrEnum):
    german = {"label": "German"}
    arabic = {"label": "Arabic"}
    bahasa = {"label": "Bahasa"}
    bengali = {"label": "Bengali"}
    chinese = {"label": "Chinese"}
    spanish = {"label": "Spanish"}
    french = {"label": "French"}
    hebrew = {"label": "Hebrew"}
    hindi = {"label": "Hindi"}
    english = {"label": "English"}
    japanese = {"label": "Japanese"}
    malay = {"label": "Malay"}
    portuguese = {"label": "Portuguese"}
    russian = {"label": "Russian"}
    thai = {"label": "Thai"}
    urdu = {"label": "Urdu"}


class AvailabilityEnum(AttrEnum):
    online = {"label": "Online"}
    physical = {"label": "Physical (CD, DVD, paper, etc)"}
    in_person = {"label": "In Person"}


class StatusEnum(AttrEnum):
    processing = {"label": "Processing"}
    answered = {"label": "Answered"}
    denied = {"label": "Denied"}


RESOURCE_TYPES = [
    "bdm_table",
    "external_link",
]  # TODO: add something that test that subclasses obey this constant


class _CkanDefaultResource(BaseModel):
    id: IdType
    name: Str
    description: Str
    position: int
    url: Optional[str]  # reserved in ckan


class Resource(_CkanDefaultResource):
    spatial_coverage: Optional[Str]  # Required for tier 1
    temporal_coverage: Optional[TemporalCoverage]  # Required for tier 1
    update_frequency: Optional[UpdateFrequencyEnum]  # Required for tier 1


# TODO: Remove only_on_types, required
# Required for later
"""
class LaiRequest(Resource):
    resource_type: Literal["lai_request"]
    
    origin: Str  # Validators  required_on_types(lai_request)
    protocol_number: Str  # Validators  required_on_types(lai_request)
    superior_organ: Str  # Validators  required_on_types(lai_request)
    linked_organ: Str  # Validators  required_on_types(lai_request)
    start_date: datetime.date  # Validators  required_on_types(lai_request) scheming_required isodate convert_to_json_if_date
    who_requested: Str  # Validators  # required_on_types(lai_request)
    status: StatusEnum  # Validatos  required_on_types(lai_request) scheming_required scheming_choices
    request_url: Str  # Validators  required_on_types(lai_request) ignore_missing unicode remove_whitespace
    data_url: Str  # Validators  ignore_missing unicode remove_whitespace #required_on_types(lai_request)
    observations: Str  # Validators  # required_on_types(lai_request)
    lai_n: int
"""


class BdmTable(Resource):
    resource_type: Literal["bdm_table"]

    table_id: Str
    auxiliary_files_url: Optional[Str]
    treatment_description: Optional[Str] = F(title="Descricao do tratamento")
    observation_level: Optional[Set[ObservationLevel]] = F(
        max_items=10
    )  # Required for tier 1
    columns: Optional[Str]  # Required for tier 1
    primary_keys: Optional[Str]  # Required for tier 1
    version: Optional[Str]  # Required for tier 1
    publisher: Optional[Str]  # Required for tier 1
    publisher_email: Optional[Str]  # Required for tier 1
    publisher_github: Optional[Str]  # Required for tier 1
    publisher_website: Optional[Str]  # Required for tier 1

    _observation_level_validator = treat_scalar_as_single_value_set("observation_level")

    bdm_file_size: Union[
        int, None, Literal["Unavailable", ""]
    ]  # should not be editable in form, also, check what use is Unavailable

    @validator("bdm_file_size")
    def null_string_is_none(
        cls, value
    ):  # TODO: check why this is not working, as it is still failing when we pass a ''. Had to add '' to type signature
        if value == "":
            return None

    # TODO: implement this
    def table_id_should_be_a_valid_bigquery_identifier(cls, value):
        pass


class BdmTableConfigs(Resource):
    ###################
    ### YAML FIELDS ###
    ###################
    dataset_id: Str = Field(
        title="dataset_id",
        default=["<dataset_id>"],
        description=["AUTO GENERATED"],
        yaml_order={
            "id_before": None,
            "id_after": "table_id",
        },
    )

    table_id: Str = Field(
        title="table_id",
        default=["<table_id>"],
        description=["AUTO GENERATED"],
        yaml_order={
            "id_before": "dataset_id",
            "id_after": "source_bucket_name",
        },
    )

    source_bucket_name: Str = Field(
        title="source_bucket_name",
        default=["<source_bucket_name>"],
        description=["AUTO GENERATED"],
        yaml_order={
            "id_before": "table_id",
            "id_after": "project_id_staging",
        },
    )

    project_id_staging: Str = Field(
        title="project_id_staging",
        default=["<project_id_staging>"],
        description=["AUTO GENERATED"],
        yaml_order={
            "id_before": "source_bucket_name",
            "id_after": "project_id_prod",
        },
    )

    project_id_prod: Str = Field(
        title="project_id_prod",
        default=["<project_id_prod>"],
        description=["AUTO GENERATED"],
        yaml_order={
            "id_before": "project_id_prod",
            "id_after": "url_ckan",
        },
    )

    url_ckan: Str = Field(
        title="url_ckan",
        default=["<https://basedosdados.org/dataset/<dataset_id>"],
        description=["AUTO GENERATED"],
        yaml_order={
            "id_before": "project_id_prod",
            "id_after": "url_github",
        },
    )

    url_github: Str = Field(
        title="url_github",
        default=[
            "<https://github.com/basedosdados/mais/tree/master/bases/<dataset_id>"
        ],
        description=["AUTO GENERATED"],
        yaml_order={
            "id_before": "url_ckan",
            "id_after": "version",
        },
    )

    version: Str = Field(
        title="version",
        default=["<vA.B>"],
        description=["Exemplo versão v1.0"],
        yaml_order={
            "id_before": "url_github",
            "id_after": "last_updated",
        },
    )
    last_updated: datetime.date = Field(
        title="last_updated",
        default=["<YYYY-MM-DD>"],
        description=["AUTO GENERATED"],
        yaml_order={
            "id_before": "version",
            "id_after": "description",
        },
    )

    description: Str = Field(
        title="description",
        default=["<descrição>"],
        description=[
            "Descreva a tabela. Essas são as primeiras frases que um usuário vai ver.",
            "Você não precisa ser muito conciso. Sinta-se a vontade para dar exemplos de",
            "como usar os dados.",
            "Se souber, liste também aplicações: pesquisa, apps, etc. que usem os dados.,",
        ],
        yaml_order={
            "id_before": "last_updated",
            "id_after": "published_by",
        },
    )

    ### TODO DITC TYPE
    published_by: Str = Field(
        title="published_by",
        default=["<nome>"],
        description=["Quem está completando esse arquivo config?"],
        yaml_order={
            "id_before": "description",
            "id_after": "treated_by",
        },
    )

    ### TODO DITC TYPE
    treated_by: Str = Field(
        title="treated_by",
        default=["<nome>"],
        description=[
            "Qual organização/departamento/pessoa tratou os dados?",
            "As vezes há um ponto intermediário entre os dados originais e subir na Base dos Dados.",
            "Se essa pessoa é você, preencha abaixo com suas informações.",
        ],
        yaml_order={
            "id_before": "published_by",
            "id_after": "treatment_description",
        },
    )

    treatment_description: Str = Field(
        title="treatment_description",
        default=["<CEPESP fez X. Eu fiz K>"],
        description=[
            "Se houve passos de tratamento, limpeza e manipulação de dados, descreva-os aqui."
        ],
        yaml_order={
            "id_before": "treated_by",
            "id_after": "data_update_frequency",
        },
    )

    data_update_frequency: Str = Field(
        title="data_update_frequency",
        default=["<frequência>"],
        description=[
            "Com qual frequência a base é atualizada?",
            "Opções: hora | dia | semana | mes | 1 ano | 2 anos | 5 anos | 10 anos | unico | recorrente",
        ],
        yaml_order={
            "id_before": "treatment_description",
            "id_after": "observation_level",
        },
    )

    observation_level: List = Field(
        title="observation_level",
        default=["<primeira coluna>"],
        description=[
            "Nível da observação (qual é a granularidade de cada linha na tabela)",
            "Escolha todas as opções necessárias.",
            "Regras:",
            "  - minúsculo, sem acento, singular.",
            "  - em portugues (ou seja, não use os nomes de colunas abaixo)",
            "Exemplos: pais, estado, municipio, cidade, hora, dia, semana, mes, ano, etc.",
        ],
        yaml_order={
            "id_before": "data_update_frequency",
            "id_after": "primary_keys",
        },
    )

    primary_keys: List = Field(
        title="primary_keys",
        default=["<primeira coluna>"],
        description=[
            "Quais colunas identificam uma linha unicamente?",
            "Preencha com os nomes de colunas. Ex: id_municipio, ano.",
            "Pode ser vazio pois certas tabelas não possuem identificadores.",
        ],
        yaml_order={
            "id_before": "observation_level",
            "id_after": "coverage_geo",
        },
    )

    coverage_geo: List = Field(
        title="coverage_geo",
        default=[
            "<admin0 - pais>",
            "<admin1 - estados/regioes/etc>",
            "<admin2 - municipios/counties/etc>",
            "<admin3 - distritos/subdistritos/etc>",
        ],
        description=[
            "Qual é a cobertura espacial da tabela?",
            "Regras:",
            "  - minúsculo, sem acento, singular",
            "  - descer até o menor nível administrativo cuja cobertura abaixo seja 'todos'",
            "Exemplo 1: tabela que cubra todos os municípios nos estados de SP e GO",
            "  - brasil",
            "  - SP, GO",
            "Exemplo 2: tabela que cubra países inteiros na América Latina",
            "  - brasil, argentina, peru, equador",
        ],
        yaml_order={
            "id_before": "primary_keys",
            "id_after": "coverage_time",
        },
    )
    coverage_time: List = Field(
        title="coverage_time",
        default=["<ano 1>", "<ano 2>"],
        description=[
            "Qual é a cobertura temporal (em anos) da tabela?",
            "Opções: ..., 1990, 1991, ..., 1999, 2000, 2001, ..., 2019, 2020, ...",
        ],
        yaml_order={
            "id_before": "coverage_geo",
            "id_after": "partitions",
        },
    )
    partitions: List = Field(
        title="partitions",
        default=["<primeira partição>"],
        description=[
            "Liste as colunas da tabela que representam partições.",
            "Não esqueça de deletar essas colunas nas tabelas .csv na hora de subir para o BigQuery.",
            "Isso poupará muito tempo e dinheiro às pessoas utilizando essa tabela.",
            "Se não houver partições, não modifique abaixo.",
        ],
        yaml_order={
            "id_before": "coverage_time",
            "id_after": "columns",
        },
    )

    columns: List = Field(
        title="columns",
        default=["<primeira coluna>"],
        description=[
            "Quais são as colunas? Certifique-se de escrever uma boa descrição, as pessoas vão gostar",
            "para saber sobre o que é a coluna.",
            "Adicionar todas as colunas manualmente pode ser bastante cansativo, por isso, quando",
            "inicializando este arquivo de configuração, você pode apontar a função para uma amostra de dados que",
            "preencherá automaticamente as colunas.",
            "Algumas colunas existirão apenas na tabela final, você as construirá em `publish.sql`.",
            "Para esses, defina is_in_staging como False.",
            "Além disso, você deve adicionar as colunas de partição aqui e definir is_partition como True.",
        ],
        yaml_order={
            "id_before": "partitions",
            "id_after": None,
        },
    )


class ExternalLink(Resource):
    resource_type: Literal["external_link"]

    url: str  # Required for tier 1 TODO: add check_url_is_alive validator check is url
    language: Optional[Set[LanguageEnum]] = Field(
        max_items=10
    )  # Required for tier 1 # TODO: @dahis, serio q eh so no external link ?
    _language_validator = treat_scalar_as_single_value_set("language")
    has_api: Optional[YES_NO]  # Required for tier 1 # TODO: data check
    free: Optional[YES_NO]  # Required for tier 1
    signup_needed: Optional[YES_NO]  # Required for tier 1
    availability: Optional[AvailabilityEnum]  # Required for tier 1
    brazilian_ip: Optional[YES_NO]  # Required for tier 1
    license_type: Optional[Str]  # Required for tier 1

    link_url: Optional[str]


def bdm_table_schema_json():
    return BdmTableConfigs.schema_json(indent=2)
