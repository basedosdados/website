from datetime import datetime
from typing import List, Literal, Optional, Set, Union
from ckanext.basedosdados.validator.available_options.spatial_coverage import (
    SpatialCoverageArea,
)

from ckanext.basedosdados.validator import treat_scalar_as_single_value_set
from ckanext.basedosdados.validator.available_options import (
    TemporalCoverageEnum,
    TimeUnitEnum,
)
from ckanext.basedosdados.validator import ObservationLevel
from ckanext.basedosdados.validator.resources import BdmColumns, _CkanDefaultResource
from ckanext.basedosdados.validator.resources.bdm import (
    LastUpdated,
    PublishedBy,
    PartnerOrganization,
)

from pydantic import StrictStr as Str, conlist as StrictList
from pydantic import validator

from .fields_definitions import *


class BdmTable(_CkanDefaultResource):
    # fmt: off
    resource_type: Literal["bdm_table"]

    dataset_id                : Str                                                       = DATASET_ID_FIELD
    table_id                  : Str                                                       = TABLE_ID_FIELD
    description               : Optional[Str]                                             = DESCRIPTION_FIELD
    spatial_coverage          : Optional[StrictList(SpatialCoverageArea, min_items=1)]    = SPATIAL_COVERAGE_FIELD
    temporal_coverage         : Optional[TemporalCoverageEnum]                            = TEMPORAL_COVERAGE_FIELD
    update_frequency          : Optional[TimeUnitEnum]                                    = UPDATE_FREQUENCY_FIELD
    observation_level         : Optional[List[ObservationLevel]]                          = OBSERVATION_LEVEL_FIELD
    last_updated              : Optional[LastUpdated]                                     = LAST_UPDATED_FIELD
    version                   : Optional[Str]                                             = VERSION_FIELD
    published_by              : Optional[PublishedBy]                                     = PUBLISHED_BY_FIELD
    data_cleaned_by           : Optional[DataCleanedBy]                                   = DATA_CLEANED_BY_FIELD
    data_cleaning_description : Optional[Str]                                             = DATA_CLEANING_DESCRIPTION_FIELD
    data_cleaning_code_url    : Optional[Str]                                             = DATA_CLEANING_CODE_URL_FIELD
    partner_organization      : Optional[PartnerOrganization]                             = PARTNER_ORGANIZATION_FIELD
    raw_files_url             : Optional[Str]                                             = RAW_FILES_URL_FIELD
    auxiliary_files_url       : Optional[Str]                                             = AUXILIARY_FILES_URL_FIELD
    architecture_url          : Optional[Str]                                             = ARCHITECTURE_URL_FIELD
    source_bucket_name        : Optional[Str]                                             = SOURCE_BUCKET_NAME_FIELD
    project_id_prod           : Optional[Str]                                             = PROJECT_ID_PROD_FIELD
    project_id_staging        : Optional[Str]                                             = PROJECT_ID_STAGING_FIELD
    partitions                : Optional[List[Str]]                                       = PARTITIONS_FIELD
    uncompressed_file_size    : Optional[int]                                             = UNCOMPRESSED_FILE_SIZE_FIELD
    compressed_file_size      : Optional[int]                                             = COMPRESSED_FILE_SIZE_FIELD
    columns                   : Optional[List[BdmColumns]]                                = COLUMNS_FIELD
    metadata_modified         : Optional[datetime]                                        = METADATA_MODIFIED_FIELD #TODO: can we rename this to last_updated and make it a derived field for dataset and all resources?
    title                     : Optional[Str]                                             = TITLE_FIELD
    n_rows                    : Optional[int]                                             = N_ROWS_FIELD
    # fmt: on
