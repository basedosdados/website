from datetime import datetime
from typing import Any, Literal, Optional, Set, Union

from ckanext.basedosdados.validator.available_options import (
    EntityEnum,
    TemporalCoverageEnum,
    TimeUnitEnum,
)
from ckanext.basedosdados.validator import SpatialCoverage
from ckanext.basedosdados.validator.packages import _CkanDefaults
from pydantic import StrictStr as Str

from .fields_definitions import *


class Dataset(_CkanDefaults):

    # fmt: off
    name               : Str                 = NAME_FIELD
    title              : Optional[Str]       = TITLE_FIELD
    organization       : Any                 = ORGANIZATION_FIELD  #TODO: can we rename this to organization_id? (Ricardo)
    notes              : Optional[Str]       = NOTES_FIELD
    groups             : Any                 = GROUPS_FIELD
    tags               : Any                 = TAGS_FIELD

    dataset_id         : Optional[Str]       = DATASET_ID_FIELD
    short_description  : Optional[Str]       = SHORT_DESCRIPTION_FIELD
    description        : Optional[Str]       = DESCRIPTION_FIELD
    ckan_url           : Optional[Str]       = CKAN_URL_FIELD
    github_url         : Optional[Str]       = GITHUB_URL_FIELD             

    metadata_modified  : Optional[datetime]  = METADATA_MODIFIED_FIELD
    visibility         : Any                 = Field(title="Visibilidade")
    cache_last_updated : Optional[datetime]
    isopen             : Optional[bool]
    # fmt: on
