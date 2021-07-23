from typing import Optional, Literal, Union
from pydantic import (
    StrictStr as Str,
)

from ckanext.basedosdados.validator import treat_scalar_as_single_value_set

from .fields_definitions import *
from ckanext.basedosdados.validator.resources import _CkanDefaultResource, BdmColumns


class BdmDictionary(_CkanDefaultResource):
    resource_type: Literal["bdm_dictionary"]

    # BdmDictionary models
    dataset_id          : Optional[Str]                                 = DATASET_ID_FIELD
    table_id            : Optional[Str]                                 = TABLE_ID_FIELD
    identifying_columns : Optional[Str]                                 = IDENTIFYING_COLUMNS_FIELD #TODO make it a list, instead of one string
    last_updated        : Optional[LastUpdated]                         = LAST_UPDATED_FIELD
    published_by        : Optional[PublishedBy]                         = PUBLISHED_BY_FIELD

    source_bucket_name : Optional[Str]                                  = SOURCE_BUCKET_NAME_FIELD
    project_id_prod    : Optional[Str]                                  = PROJECT_ID_PROD_FIELD
    project_id_staging : Optional[Str]                                  = PROJECT_ID_STAGING_FIELD
    partitions         : Optional[Str]                                  = PARTITIONS_FIELD
    bdm_file_size      : Union[int, None, Literal["Unavailable", ""]]   = BDM_FILE_SIZE_FIELD # should not be editable in form, also, check what use is Unavailable
    columns            : Optional[BdmColumns]                           = COLUMNS_FIELD           #TODO: this model come from column module and are a list of columns