
from typing import Optional, Literal, Set, Union

from pydantic import (
    StrictStr as Str
)

from .fields_definitions import *
from ckanext.basedosdados.validator.resources import _CkanDefaultResource
from ckanext.basedosdados.validator import treat_scalar_as_single_value_set
from ckanext.basedosdados.validator.available_options import (
    TemporalCoverageEnum,
    EntityEnum,
    TimeUnitEnum,
    StatusEnum
)

class InformationRequest(_CkanDefaultResource): 
    resource_type: Literal["information_request"]
    
    # InformationRequest models
    dataset_id        : Optional[Str]                                  = DATASET_ID_FIELD
    origin            : Optional[Str]                                  = ORIGIN_FIELD
    number            : Optional[Str]                                  = NUMBER_FIELD
    url               : Optional[Str]                                  = URL_FIELD
    department        : Optional[Str]                                  = DEPARTMENT_FIELD
    description       : Optional[Str]                                  = DESCRIPTION_FIELD
    opening_date      : Optional[Str]                                  = OPENING_DATE_FIELD
    requested_by      : Optional[RequestedBy]                          = REQUESTED_BY_FIELD
    spatial_coverage  : Union[Optional[SpatialCoverage],Optional[Str]] = SPATIAL_COVERAGE_FIELD # TODO: remove Optional[Str] after migration
    temporal_coverage : Optional[TemporalCoverageEnum]                 = TEMPORAL_COVERAGE_FIELD
    update_frequency  : Optional[TimeUnitEnum]                         = UPDATE_FREQUENCY_FIELD
    entity            : Optional[Set[EntityEnum]]                      = ENTITY_FIELD
    time_unit         : Optional[TimeUnitEnum]                         = TIME_UNIT_FIELD
    status            : Optional[StatusEnum]                           = STATUS_FIELD
    data_url          : Optional[Str]                                  = DATA_URL_FIELD
    observations      : Optional[Str]                                  = OBSERVATIONS_FIELD
    