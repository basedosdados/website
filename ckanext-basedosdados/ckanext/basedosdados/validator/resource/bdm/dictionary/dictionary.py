from typing import Optional, Literal, Union, Set
from pydantic import (
    StrictStr as Str,
    validator,
)

from ckanext.basedosdados.validator import treat_scalar_as_single_value_set

from .fields_definitions import *
from ckanext.basedosdados.validator.resource import _CkanDefaultResource

class BdmDictionary(Resource):
    resource_type: Literal["bdm_dictionary"]

    dataset_id          : Str     = DATASET_ID_FIELD
    table_id            : Str     = TABLE_ID_FIELD
    last_updated        : Str     = LAST_UPDATED_FIELD

    bdm_file_size: Union[int, None, Literal["Unavailable", ""]]  # should not be editable in form, also, check what use is Unavailable

    @validator("bdm_file_size")
    def null_string_is_none(
        cls, value
    ):  # TODO: check why this is not working, as it is still failing when we pass a ''. Had to add '' to type signature
        if value == "":
            return None

    # TODO: implement this
    def table_id_should_be_a_valid_bigquery_identifier(cls, value):
        pass
