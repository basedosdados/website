from pydantic import BaseModel, ValidationError, validator, StrictStr as Str
from typing import List, Optional

from ckanext.basedosdados.validator import BaseModel

from ckanext.basedosdados.validator.resources.bdm.columns.columns_definitions import *


class ColumnsMetadata(BaseModel):
    name: Optional[Str] = NAME_FIELD
    description: Optional[Str] = DESCRIPTION_FIELD
    is_in_staging: Optional[bool] = IS_IN_STAGING_FIELD
    is_partition: Optional[bool] = IS_PARTITION_FIELD


class BdmColumns(BaseModel):
    columns: Optional[ColumnsMetadata] = COLUMNS_FIELD
