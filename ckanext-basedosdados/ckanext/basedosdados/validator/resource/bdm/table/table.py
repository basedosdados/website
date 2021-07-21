from typing import Optional, Literal, Union, Set
from pydantic import (
    StrictStr as Str,
    validator,
)

from ckanext.basedosdados.validator import treat_scalar_as_single_value_set
from ckanext.basedosdados.validator.available_options import (
    ObservationLevel,
    TemporalCoverage,
    UpdateFrequencyEnum,
)

from .fields_definitions import *
from ckanext.basedosdados.validator.resource import _CkanDefaultResource

class BdmTable(Resource):
    resource_type: Literal["bdm_table"]

    dataset_id                  : [Str]                                 = DATASET_ID_FIELD
    table_id                    : Str                                   = TABLE_ID_FIELD
    description                 : Optional[Str]                         = DESCRIPTION_FIELD
    spatial_coverage            : Optional[SpatialCoverage]             = SPATIAL_COVERAGE_FIELD
    observation_level           : Optional[Set[ObservationLevelEnum]]   = OBSERVATIONAL_LEVEL_FIELD
    temporal_coverage           : Optional[TemporalCoverage]            = TEMPORAL_COVERAGE_FIELD
    update_frequency            : Optional[TimeUnitEnum]                = UPDATE_FREQUENCY_FIELD
    time_unit                   : Optional[TimeUnitEnum]                = TIME_UNIT_FIELD
    identifying_columns         : Optional[Str]                         = IDENTIFYING_COLUMNS_FIELD #TODO make it a list, instead of one string
    last_updated                : Optional[LastUpdated]                 = LAST_UPDATED_FIELD  #TODO to include last release, data, metadata
    version                     : Optional[Str]                         = VERSION_FIELD
    published_by                : Optional[PublishedBy]                 = PUBLISHED_BY_FIELD
    treated_by                  : Optional[TreatedBy]                   = TREATED_BY_FIELD
    data_cleaning_description   : Optional[Str]                         = DATA_CLEANING_DESCRIPTION_FIELD
    raw_url                     : Optional[Str]                         = RAW_URL_FIELD
    auxiliary_files_url         : Optional[Str]                         = AUXILIARY_FILES_URL_FIELD
    architecture_url            : Optional[Str]                         = ARCHITECTURE_URL_FIELD
    covered_by_dictionary       : Optional[YesNoEnum]                   = COVERED_BY_DICTIONARY_FIELD
    
    columns                     : Optional[Str]

    source_bucket_name          : Optional[Str]                         = SOURCE_BUCKET_NAME_FIELD
    project_id_staging          : Optional[Str]                         = PROJECT_ID_STAGING_FIELD
    project_id_prod             : Optional[Str]                         = PROJECT_ID_PROD_FIELD
    url_ckan                    : Optional[Str]                         = URL_CKAN_FIELD
    url_github                  : Optional[Str]                         = URL_GITHUB_FIELD
    partitions                  : Optional[Str]                         = PARTITIONS_FIELD

    _observation_level_validator = treat_scalar_as_single_value_set("observation_level")

    bdm_file_size: Union[int, None, Literal["Unavailable", ""]]  # should not be editable in form, also, check what use is Unavailable

    @validator("bdm_file_size")
    def null_string_is_none(
        cls, value
    ):  # TODO: check why this is not working, as it is still failing when we pass a ''. Had to add '' to type signature
        if value == "":
            return None

    # TODO: implement this
    def table_id_should_be_a_valid_bigquery_identifier(cls, value):
        pass
