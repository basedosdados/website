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


# TODO: investigate why when put the Enum types the forms dont show the fields
class BdmColumns(BaseModel):

    # ColumnsMetadata models
    # fmt: off
    name                  : Str                            = NAME_FIELD
    bigquery_type         : BigQueryTypeEnum               = BIGQUERY_TYPE_FIELD
    description           : Str                            = DESCRIPTION_FIELD
    temporal_coverage     : Optional[TemporalCoverageEnum] = TEMPORAL_COVERAGE_FIELD
    covered_by_dictionary : Optional[YesNoEnum]            = COVERED_BY_DICTIONARY_FIELD
    directory_column      : Optional[DirectoryColumn]      = DIRECTORY_COLUMN_FIELD
    measurement_unit      : Optional[MeasurementUnitEnum]  = MEASUREMENT_UNIT_FIELD
    has_sensitive_data    : Optional[YesNoEnum]            = HAS_SENSITIVE_DATA_FIELD
    is_in_staging         : Optional[bool]                 = IS_IN_STAGING_FIELD
    is_partition          : Optional[bool]                 = IS_PARTITION_FIELD
    # original_names       : Optional[List[Str]] = ORIGINAL_NAMES_FIELD #TODO: make it a complex field of dictionaries mapping year to name. Ex: {2015: "name_1", 2016: "name_2"}
    # fmt: on
