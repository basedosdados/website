from datetime import datetime
from typing import Optional, Literal, Any

from pydantic import StrictStr as Str

from .fields_definitions import *
from ckanext.basedosdados.validator.packages import _CkanDefaults

class Dataset(_CkanDefaults):
    # Generated Fields
    # temporal_coverage: TemporalCoverage
    # spatial_coverage: Str
    # observation_level: List[ObservationLevel] = Field(max_items=10)
    # auxiliary_files_url: List[Str]

    download_type       : Optional[Literal["Fonte Externa", "BD+", "BD Mais","Link Externo"]]  # TODO: generate this automatically. Remove "BD Mais","Link Externo" after migration

    # Ckan Defaults with description
    author              : Optional[Str]      = AUTHOR_FIELD  # This field have name and email in YAML
    metadata_modified   : Optional[datetime] = METADATA_MODIFIED_FIELD

    # Ckan Defaults Complex Fields
    groups              : Any                = GROUPS_FIELD
    organization        : Any                = ORGANIZATION_FIELD  #TODO: can we rename this to organization_id? (Ricardo)
    tags                : Any                = TAGS_FIELD

    # TODO: Remove optional from required fields bellow
    # New dataset fields
    dataset_id          : Optional[Str]     = DATASET_ID_FIELD
    title               : Optional[Str]     #= TITLE_FIELD
    description         : Optional[Str]     = DESCRIPTION_FIELD
    spatial_coverage    : Optional[Str]     #= SPATIAL_COVERAGE_FIELD
    observation_level   : Optional[Str]     #= OBSERVATIONAL_LEVEL_FIELD
    temporal_coverage   : Optional[Str]     #= TEMPORAL_COVERAGE_FIELD
    update_frequency    : Optional[Str]     #= UPDATE_FREQUENCY_FIELD
    time_unit           : Optional[Str]     #= TIME_UNIT_FIELD


    #url_ckan    : Optional[Str]     = URL_CKAN_FIELD
    #url_github  : Optional[Str]     = URL_GITHUB_FIELD
    #website     : Optional[Str]     = WEBSITE_FIELD
    #languages   : Optional[Str]     = LANGUAGES_FIELD
    #free        : Optional[Str]     = FREE_FIELD
    #microdata   : Optional[Str]     = MICRODATA_FIELD
    #API         : Optional[Str]     = API_FIELD
    #availability: Optional[Str]     = AVAILABILITY_FIELD
    #brazilian_IP: Optional[Str]     = BRAZILIAN_IP_FIELD
    #license     : Optional[Licence] = LICENSE_FIELD


# TODO: try to access fields on validation and get annotations on which fields are needed for each tier
