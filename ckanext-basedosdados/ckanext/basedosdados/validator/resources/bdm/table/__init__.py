from typing import Optional, Literal, Union, Set, List
from pydantic import (
    StrictStr as Str,
    validator,
)
from .fields_definitions import *
from ckanext.basedosdados.validator.resources import _CkanDefaultResource, BdmColumns
from ckanext.basedosdados.validator import treat_scalar_as_single_value_set
from ckanext.basedosdados.validator.available_options import (
    TemporalCoverageEnum,
    EntityEnum,
    TimeUnitEnum,
    YesNoEnum
)

class BdmTable(_CkanDefaultResource):
    resource_type: Literal["bdm_table"]

    # BdmTable models
    dataset_id                : Optional[Str]                                    = DATASET_ID_FIELD
    table_id                  : Str                                              = TABLE_ID_FIELD
    description               : Optional[Str]                                    = DESCRIPTION_FIELD
    spatial_coverage          : Union[Optional[SpatialCoverage], Optional[Str]]  = SPATIAL_COVERAGE_FIELD
    temporal_coverage         : Optional[TemporalCoverageEnum]                   = TEMPORAL_COVERAGE_FIELD
    update_frequency          : Optional[TimeUnitEnum]                           = UPDATE_FREQUENCY_FIELD
    entity                    : Optional[Set[EntityEnum]]                        = ENTITY_FIELD
    time_unit                 : Optional[TimeUnitEnum]                           = TIME_UNIT_FIELD
    identifying_columns       : Optional[List[Str]]                              = IDENTIFYING_COLUMNS_FIELD
    last_updated              : Optional[LastUpdated]                            = LAST_UPDATED_FIELD
    version                   : Optional[Str]                                    = VERSION_FIELD
    published_by              : Optional[PublishedBy]                            = PUBLISHED_BY_FIELD
    data_cleaned_by           : Optional[DataCleanedBy]                          = DATA_CLEANED_BY_FIELD
    data_cleaning_description : Optional[Str]                                    = DATA_CLEANING_DESCRIPTION_FIELD
    raw_files_url             : Optional[Str]                                    = RAW_FILES_URL_FIELD
    auxiliary_files_url       : Optional[Str]                                    = AUXILIARY_FILES_URL_FIELD
    architecture_url          : Optional[Str]                                    = ARCHITECTURE_URL_FIELD
    covered_by_dictionary     : Optional[YesNoEnum]                              = COVERED_BY_DICTIONARY_FIELD
    source_bucket_name        : Optional[Str]                                    = SOURCE_BUCKET_NAME_FIELD
    project_id_prod           : Optional[Str]                                    = PROJECT_ID_PROD_FIELD
    project_id_staging        : Optional[Str]                                    = PROJECT_ID_STAGING_FIELD
    partitions                : Optional[Str]                                    = PARTITIONS_FIELD
    bdm_file_size             : Union[int, None, Literal["Unavailable", ""]]     = BDM_FILE_SIZE_FIELD # should not be editable in form, also, check what use is Unavailable
    columns                   : Union[Optional[List[BdmColumns]], Optional[Str]] = COLUMNS_FIELD
    
    # -------------------------------------
    # VALIDATORS
    # -------------------------------------
    _entity_validator = treat_scalar_as_single_value_set("entity")

    @validator("bdm_file_size")
    def null_string_is_none(
        cls, value
    ):  # TODO: check why this is not working, as it is still failing when we pass a ''. Had to add '' to type signature
        if value == "":
            return None
        return value

    # TODO: impleboont this
    def table_id_should_be_a_valid_bigquery_identifier(cls, value):
        pass
