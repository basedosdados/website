from typing import Optional, Literal, Union, Set
from pydantic import (
    StrictStr as Str,
    validator,
)

from ckanext.basedosdados.validator import treat_scalar_as_single_value_set

from .fields_definitions import *
from ckanext.basedosdados.validator.resources import _CkanDefaultResource


class BdmDictionary(_CkanDefaultResource):
    resource_type: Literal["bdm_dictionary"]

    dataset_id  : Str = DATASET_ID_FIELD
    table_id    : Str = TABLE_ID_FIELD
    last_updated: Str = LAST_UPDATED_FIELD