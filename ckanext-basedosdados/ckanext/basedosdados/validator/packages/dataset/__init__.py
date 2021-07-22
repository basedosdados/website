from datetime import datetime
from typing import Optional, Literal, Any, Set

from pydantic import StrictStr as Str

from .fields_definitions import *
from ckanext.basedosdados.validator.packages import _CkanDefaults
from ckanext.basedosdados.validator.available_options import (
    TemporalCoverageEnum,
    EntityEnum,
    TimeUnitEnum,
)
    
class Dataset(_CkanDefaults):

    # Ckan Defaults with description
    author              : Optional[Str]      = AUTHOR_FIELD  # This field have name and email in YAML
    metadata_modified   : Optional[datetime] = METADATA_MODIFIED_FIELD

    # Ckan Defaults Complex Fields
    groups              : Any                = GROUPS_FIELD
    organization        : Any                = ORGANIZATION_FIELD  #TODO: can we rename this to organization_id? (Ricardo)
    tags                : Any                = TAGS_FIELD

    # Dataset models
    organization_id   : Optional[Str]                       = ORGANIZATION_ID_FIELD
    dataset_id        : Optional[Str]                       = DATASET_ID_FIELD
    title             : Optional[Str]                       = TITLE_FIELD
    description       : Optional[Str]                       = DESCRIPTION_FIELD
    tag_string        : Optional[Str]                       = TAG_STRING_FIELD
    spatial_coverage  : Optional[Str]                       = SPATIAL_COVERAGE_FIELD #TODO: adds available options
    temporal_coverage : Optional[TemporalCoverageEnum]      = TEMPORAL_COVERAGE_FIELD
    update_frequency  : Optional[TimeUnitEnum]              = UPDATE_FREQUENCY_FIELD
    entity            : Optional[Set[EntityEnum]]           = ENTITY_FIELD
    time_unit         : Optional[TimeUnitEnum]              = TIME_UNIT_FIELD
    download_type     : Optional[Literal["BD Mais","Link Externo"]]  # TODO: generate this automatically. Remove "BD Mais","Link Externo" after migration
    ckan_url          : Optional[Str]                       = CKAN_URL_FIELD
    github_url        : Optional[Str]                       = GITHUB_URL_FIELD
    
    # -------------------------------------
    # VALIDATORS
    # -------------------------------------
    # TODO: try to access fields on validation and get annotations on which fields are needed for each tier
