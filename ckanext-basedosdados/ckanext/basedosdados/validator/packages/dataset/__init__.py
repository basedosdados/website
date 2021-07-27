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
    author              : Optional[Str]                     = AUTHOR_FIELD  #TODO: can we delete this field?
    metadata_modified   : Optional[datetime]                = METADATA_MODIFIED_FIELD #TODO: can we rename this to last_updated and make it a derived field for dataset and all resources?

    # Ckan Defaults Complex Fields
    groups              : Any                               = GROUPS_FIELD
    organization        : Any                               = ORGANIZATION_FIELD  #TODO: can we rename this to organization_id? (Ricardo)
    tags                : Any                               = TAGS_FIELD
    visibility          : Any                               = VISIBILITY_FIELD  #TODO: this is a ready-made CKAN field. understand how to include here.

    # Dataset models
    dataset_id        : Optional[Str]                       = DATASET_ID_FIELD
    title             : Optional[Str]                       = TITLE_FIELD
    description       : Optional[Str]                       = DESCRIPTION_FIELD
    spatial_coverage  : Optional[SpatialCoverage]           = SPATIAL_COVERAGE_FIELD #TODO: adds SpatialCoverage in fileds_definitions.py
    temporal_coverage : Optional[TemporalCoverageEnum]      = TEMPORAL_COVERAGE_FIELD
    update_frequency  : Optional[TimeUnitEnum]              = UPDATE_FREQUENCY_FIELD
    entity            : Optional[Set[EntityEnum]]           = ENTITY_FIELD
    time_unit         : Optional[TimeUnitEnum]              = TIME_UNIT_FIELD
    ckan_url          : Optional[Str]                       = CKAN_URL_FIELD
    github_url        : Optional[Str]                       = GITHUB_URL_FIELD
    
    download_type     : Optional[Literal["BD Mais","Link Externo", "Pedido de Informação", "Dicionário BD Mais"]]  # TODO: generate this automatically. Remove "BD Mais", "Link Externo" after migration
    
    cache_last_updated: Optional[datetime]
    isopen            : Optional[bool]
    extras            : Optional[Any]                    

    # -------------------------------------
    # VALIDATORS
    # -------------------------------------
    # TODO: try to access fields on validation and get annotations on which fields are needed for each tier
