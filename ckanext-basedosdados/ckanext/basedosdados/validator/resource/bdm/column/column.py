from pydantic import StrictStr as Str
from typing import Optional

from ckanext.basedosdados.validator import BaseModel
from .fields_definitions import *

from ckanext.basedosdados.validator.available_options import (
    BigQueryTypeEnum,
    TemporalCoverage,
    YesNoEnum
)

class ColumnsMetadata(BaseModel):
    table_id                : Optional[Str]
    name                    : Optional[Str]                 = NAME_FIELD
    bigquery_type           : Optional[BigQueryTypeEnum]    = BIGQUERY_TYPE_FIELD
    description             : Optional[Str]                 = DESCRIPTION_FIELD
    temporal_coverage       : Optional[TemporalCoverage]    = TEMPORAL_COVERAGE_FIELD
    covered_by_dictionary   : Optional[YesNoEnum]           = COVERED_BY_DICTIONARY_FIELD
    directory_column        : Optional[Str]                 = DIRECTORY_COLUMN_FIELD
    measurement_unit        : Optional[Str]                 = MEASUREMENT_UNIT_FIELD
    original_names          : Optional[Str]                 = ORIGINAL_NAMES_FIELD  # TODO: make it into a list of string entries
    is_in_staging           : Optional[bool]                = IS_IN_STAGING_FIELD
    is_partition            : Optional[bool]                = IS_PARTITION_FIELD


class BdmColumns(BaseModel):
    columns: Optional[ColumnsMetadata] = COLUMNS_FIELD
