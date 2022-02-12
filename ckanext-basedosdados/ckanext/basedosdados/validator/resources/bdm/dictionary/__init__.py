from typing import List, Literal, Optional, Union

from ckanext.basedosdados.validator import treat_scalar_as_single_value_set
from ckanext.basedosdados.validator.resources import BdmColumns, _CkanDefaultResource
from ckanext.basedosdados.validator.resources.bdm import LastUpdated, PublishedBy

from pydantic import StrictStr as Str

from .fields_definitions import *


class BdmDictionary(_CkanDefaultResource):
    resource_type: Literal["bdm_dictionary"]

    # BdmDictionary models
    # fmt: off
    dataset_id          : Str                   = DATASET_ID_FIELD
    table_id            : Str                   = TABLE_ID_FIELD
    identifying_columns : Optional[List[Str]]   = IDENTIFYING_COLUMNS_FIELD
    last_updated        : Optional[LastUpdated] = LAST_UPDATED_FIELD
    published_by        : Optional[PublishedBy] = PUBLISHED_BY_FIELD
    # fmt: on

    # fmt: off
    source_bucket_name : Optional[Str]                                    = SOURCE_BUCKET_NAME_FIELD
    project_id_prod    : Optional[Str]                                    = PROJECT_ID_PROD_FIELD
    project_id_staging : Optional[Str]                                    = PROJECT_ID_STAGING_FIELD
    partitions         : Optional[Str]                                    = PARTITIONS_FIELD
    bdm_file_size      : Union[int, None, Literal["Unavailable", ""]]     = BDM_FILE_SIZE_FIELD # should not be editable in form, also, check what use is Unavailable
    columns            : Optional[List[BdmColumns]]                       = COLUMNS_FIELD
    # fmt: on
