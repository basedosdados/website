from pydantic import StrictStr as Str
from typing import Optional

from ckanext.basedosdados.validator import BaseModel
from .fields_definitions import *

from ckanext.basedosdados.validator.available_options import (
    BigQueryTypeEnum,
    TemporalCoverageEnum,
    YesNoEnum,
    MeasurementUnitEnum
)

# #TODO: define more fields
# class DirectoryColumn(BaseModel):
#     dataset_id:
#     table_id:
#     column_name:

#TODO: investigate why when put the Enum types the forms dont show the fields
class BdmColumns(BaseModel):
    # ColumnsMetadata models
    dataset_id           : Optional[Str]                 = DATASET_ID_FIELD
    table_id             : Str                           = TABLE_ID_FIELD
    name                 : Optional[Str]                 = NAME_FIELD
    # bigquery_type        : Optional[BigQueryTypeEnum]    = BIGQUERY_TYPE_FIELD
    description          : Optional[Str]                 = DESCRIPTION_FIELD
    # temporal_coverage    : Optional[TemporalCoverageEnum]= TEMPORAL_COVERAGE_FIELD
    # covered_by_dictionary: Optional[YesNoEnum]           = COVERED_BY_DICTIONARY_FIELD
    # measurement_unit     : Optional[MeasurementUnitEnum] = MEASUREMENT_UNIT_FIELD
    original_names       : Optional[Str]                 = ORIGINAL_NAMES_FIELD  # TODO: make it into a list of string entries

    
    #ColumnsMetadata models that are not in schema
    directory_column     : Optional[Str]                 = DIRECTORY_COLUMN_FIELD
    is_in_staging        : Optional[bool]                = IS_IN_STAGING_FIELD
    is_partition         : Optional[bool]                = IS_PARTITION_FIELD

