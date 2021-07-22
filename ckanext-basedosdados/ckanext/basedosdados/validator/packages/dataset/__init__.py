from datetime import datetime
from typing import Optional, Literal, Any, Set

from pydantic import StrictStr as Str

from .fields_definitions import *
from ckanext.basedosdados.validator.packages import _CkanDefaults
from ckanext.basedosdados.validator.available_options import (
    ObservationLevelEnum,
    TemporalCoverageEnum,
    TimeUnitEnum,
)
    
class Dataset(_CkanDefaults):
    download_type       : Optional[Literal["BD Mais","Link Externo"]]  # TODO: generate this automatically. Remove "BD Mais","Link Externo" after migration

    # Ckan Defaults with description
    author              : Optional[Str]      = AUTHOR_FIELD  # This field have name and email in YAML
    metadata_modified   : Optional[datetime] = METADATA_MODIFIED_FIELD

    # Ckan Defaults Complex Fields
    groups              : Any                = GROUPS_FIELD
    organization        : Any                = ORGANIZATION_FIELD  #TODO: can we rename this to organization_id? (Ricardo)
    tags                : Any                = TAGS_FIELD

    # TODO: Remove optional from required fields bellow
    # Dataset models
    dataset_id        : Optional[Str]                       = DATASET_ID_FIELD
    organization_id   : Optional[Str]                       = ORGANIZATION_ID_FIELD
    title             : Optional[Str]                       = TITLE_FIELD
    description       : Optional[Str]                       = DESCRIPTION_FIELD
    tag_string        : Optional[Str]                       = TAG_STRING_FIELD
    download_type     : Optional[Str]                       = DOWNLOAD_TYPE_FIELD
    spatial_coverage  : Optional[Str]                       = SPATIAL_COVERAGE_FIELD #TODO: adds available options
    temporal_coverage : Optional[TemporalCoverageEnum]      = TEMPORAL_COVERAGE_FIELD
    observation_level : Optional[Set[ObservationLevelEnum]] = OBSERVATIONAL_LEVEL_FIELD
    time_unit         : Optional[TimeUnitEnum]              = TIME_UNIT_FIELD
    
    # Dataset models that are not in schema
    update_frequency : Optional[Str] = UPDATE_FREQUENCY_FIELD

    # -------------------------------------
    # VALIDATORS
    # -------------------------------------
    # TODO: try to access fields on validation and get annotations on which fields are needed for each tier
