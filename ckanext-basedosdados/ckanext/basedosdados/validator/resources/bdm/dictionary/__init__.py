from typing import Optional, Literal
from pydantic import (
    StrictStr as Str,
)

from ckanext.basedosdados.validator import treat_scalar_as_single_value_set

from .fields_definitions import *
from ckanext.basedosdados.validator.resources import _CkanDefaultResource


class BdmDictionary(_CkanDefaultResource):
    resource_type: Literal["bdm_dictionary"]

    # BdmDictionary models
    dataset_id   : Optional[Str]        = DATASET_ID_FIELD
    table_id     : Optional[Str]        = TABLE_ID_FIELD
    last_updated: Optional[LastUpdated] = LAST_UPDATED_FIELD