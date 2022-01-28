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

    # Ckan Defaults with description
    # fmt: off
    author             : Optional[Str]       = AUTHOR_FIELD  #TODO: can we delete this field?
    metadata_modified  : Optional[datetime]  = METADATA_MODIFIED_FIELD #TODO: can we rename this to last_updated and make it a derived field for dataset and all resources?
    # fmt: off

    # Ckan Defaults Complex Fields
    # fmt: off
    groups             : Any                 = GROUPS_FIELD
    organization       : Any                 = ORGANIZATION_FIELD  #TODO: can we rename this to organization_id? (Ricardo)
    tags               : Any                 = TAGS_FIELD
    visibility         : Any                 = VISIBILITY_FIELD  #TODO: this is a ready-made CKAN field. understand how to include here.
    # fmt: on

    # Dataset models
    # fmt: off
    title              : Optional[Str]       = TITLE_FIELD
    short_description  : Optional[Str]       = SHORT_DESCRIPTION_FIELD
    description        : Optional[Str]       = DESCRIPTION_FIELD
    ckan_url           : Optional[Str]       = CKAN_URL_FIELD
    github_url         : Optional[Str]       = GITHUB_URL_FIELD             
    cache_last_updated : Optional[datetime]
    isopen             : Optional[bool]
    # fmt: on

    # -------------------------------------
    # VALIDATORS
    # -------------------------------------
    # TODO: try to access fields on validation and get annotations on which fields are needed for each tier
