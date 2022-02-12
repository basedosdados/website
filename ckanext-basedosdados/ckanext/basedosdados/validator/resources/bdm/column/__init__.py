from typing import List, Optional

from ckanext.basedosdados.validator import BaseModel
from ckanext.basedosdados.validator.available_options import (
    BigQueryTypeEnum,
    MeasurementUnitEnum,
    TemporalCoverageEnum,
    YesNoEnum,
)
from pydantic import StrictStr as Str

from .fields_definitions import *


class BdmColumns(BaseModel):

    # fmt: off
    name                  : Str                            = NAME_FIELD
    bigquery_type         : Optional[BigQueryTypeEnum]     = BIGQUERY_TYPE_FIELD
    description           : Optional[Str]                  = DESCRIPTION_FIELD
    temporal_coverage     : Optional[TemporalCoverageEnum] = TEMPORAL_COVERAGE_FIELD
    covered_by_dictionary : Optional[YesNoEnum]            = COVERED_BY_DICTIONARY_FIELD
    directory_column      : Optional[DirectoryColumn]      = DIRECTORY_COLUMN_FIELD
    measurement_unit      : Optional[Str]                  = MEASUREMENT_UNIT_FIELD
    has_sensitive_data    : Optional[YesNoEnum]            = HAS_SENSITIVE_DATA_FIELD
    observations          : Optional[Str]                  = OBSERVATIONS_FIELD
    is_in_staging         : Optional[bool]                 = IS_IN_STAGING_FIELD
    is_partition          : Optional[bool]                 = IS_PARTITION_FIELD
    # fmt: on
