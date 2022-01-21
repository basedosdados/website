from datetime import datetime
from typing import List, Literal, Optional, Set, Union

from ckanext.basedosdados.validator import treat_scalar_as_single_value_set
from ckanext.basedosdados.validator.available_options import (
    TemporalCoverageEnum,
    TimeUnitEnum,
)
from ckanext.basedosdados.validator import SpatialCoverage, ObservationLevel
from ckanext.basedosdados.validator.resources import BdmColumns, _CkanDefaultResource
from ckanext.basedosdados.validator.resources.bdm import LastUpdated, PublishedBy, PartnerOrganization

from pydantic import StrictStr as Str
from pydantic import validator

from .fields_definitions import *


class BdmTable(_CkanDefaultResource):
    # fmt: off
    resource_type: Literal["bdm_table"]

    metadata_modified         : Optional[datetime]                               = METADATA_MODIFIED_FIELD #TODO: can we rename this to last_updated and make it a derived field for dataset and all resources?
    # BdmTable models
    dataset_id                : Str                                              = DATASET_ID_FIELD
    table_id                  : Str                                              = TABLE_ID_FIELD
    description               : Optional[Str]                                    = DESCRIPTION_FIELD
    spatial_coverage          : Union[Optional[SpatialCoverage], Optional[Str]]  = SPATIAL_COVERAGE_FIELD
    temporal_coverage         : Optional[TemporalCoverageEnum]                   = TEMPORAL_COVERAGE_FIELD
    update_frequency          : Optional[TimeUnitEnum]                           = UPDATE_FREQUENCY_FIELD
    observation_level         : Optional[List[ObservationLevel]]                 = OBSERVATION_LEVEL_FIELD
    last_updated              : Optional[LastUpdated]                            = LAST_UPDATED_FIELD
    version                   : Optional[Str]                                    = VERSION_FIELD
    published_by              : Optional[PublishedBy]                            = PUBLISHED_BY_FIELD
    data_cleaned_by           : Optional[DataCleanedBy]                          = DATA_CLEANED_BY_FIELD
    data_cleaning_description : Optional[Str]                                    = DATA_CLEANING_DESCRIPTION_FIELD
    data_cleaning_code_url    : Optional[Str]                                    = DATA_CLEANING_CODE_URL_FIELD
    partner_organization      : Optional[PartnerOrganization]                    = PARTNER_ORGANIZATION_FIELD
    raw_files_url             : Optional[Str]                                    = RAW_FILES_URL_FIELD
    auxiliary_files_url       : Optional[Str]                                    = AUXILIARY_FILES_URL_FIELD
    architecture_url          : Optional[Str]                                    = ARCHITECTURE_URL_FIELD
    source_bucket_name        : Optional[Str]                                    = SOURCE_BUCKET_NAME_FIELD
    project_id_prod           : Optional[Str]                                    = PROJECT_ID_PROD_FIELD
    project_id_staging        : Optional[Str]                                    = PROJECT_ID_STAGING_FIELD
    partitions                : Optional[Str]                                    = PARTITIONS_FIELD
    bdm_file_size             : Union[int, None, Literal["Unavailable", ""]]     = BDM_FILE_SIZE_FIELD # should not be editable in form, also, check what use is Unavailable
    columns                   : Union[Optional[List[BdmColumns]], Optional[Str]] = COLUMNS_FIELD
    # fmt: on

    # -------------------------------------
    # VALIDATORS
    # -------------------------------------

    @validator("bdm_file_size")
    def null_string_is_none(cls, value):
        # TODO: check why this is not working,
        # as it is still failing when we pass a ''.
        # Had to add '' to type signature
        if value == "":
            return None
        return value

    # TODO: implement this
    def table_id_should_be_a_valid_bigquery_identifier(cls, value):
        pass
