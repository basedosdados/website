from pydantic import StrictStr as Str
from typing import Optional

from ckanext.basedosdados.validator import BaseModel
from .fields_definitions import *


class ColumnsMetadata(BaseModel):
    name         : Optional[Str]  = NAME_FIELD
    description  : Optional[Str]  = DESCRIPTION_FIELD
    is_in_staging: Optional[bool] = IS_IN_STAGING_FIELD
    is_partition : Optional[bool] = IS_PARTITION_FIELD


class BdmColumns(BaseModel):
    columns: Optional[ColumnsMetadata] = COLUMNS_FIELD
