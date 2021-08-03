from pydantic import StrictStr as Str
from typing import Optional, List

from .fields_definitions import *
from ckanext.basedosdados.validator import BaseModel
from ckanext.basedosdados.validator.available_options import (
    BigQueryTypeEnum,
    TemporalCoverageEnum,
    YesNoEnum,
    MeasurementUnitEnum
)

#TODO: investigate why when put the Enum types the forms dont show the fields
class BdmColumns(BaseModel):
    
    # ColumnsMetadata models
    dataset_id           : Optional[Str]                 = DATASET_ID_FIELD
    table_id             : Optional[Str]                 = TABLE_ID_FIELD
    name                 : Optional[Str]                 = NAME_FIELD
    bigquery_type        : Optional[BigQueryTypeEnum]    = BIGQUERY_TYPE_FIELD
    description          : Optional[Str]                 = DESCRIPTION_FIELD
    temporal_coverage    : Optional[TemporalCoverageEnum]= TEMPORAL_COVERAGE_FIELD
    covered_by_dictionary: Optional[YesNoEnum]           = COVERED_BY_DICTIONARY_FIELD
    directory_column     : Optional[DirectoryColumn]     = DIRECTORY_COLUMN_FIELD
    measurement_unit     : Optional[MeasurementUnitEnum] = MEASUREMENT_UNIT_FIELD
    #original_names       : Optional[List[Str]]           = ORIGINAL_NAMES_FIELD #TODO: make it a complex field of dictionaries mapping year to name. Ex: {2015: "name_1", 2016: "name_2"}

    is_in_staging        : Optional[bool]                = IS_IN_STAGING_FIELD
    is_partition         : Optional[bool]                = IS_PARTITION_FIELD

