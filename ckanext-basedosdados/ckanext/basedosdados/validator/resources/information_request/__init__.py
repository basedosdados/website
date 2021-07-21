
from typing import Optional, Literal, Set

from pydantic import (
    StrictStr as Str,
    Field,
)

from ckanext.basedosdados.validator import treat_scalar_as_single_value_set
from ckanext.basedosdados.validator.available_options import (
    SpacialCoverageEnum,
    ObservationLevelEnum,
    TemporalCoverageEnum,
    TimeUnitEnum,
    StatusEnum
)

from .fields_definitions import *
from ckanext.basedosdados.validator.resources import _CkanDefaultResource

class InformationRequest(_CkanDefaultResource): 
    resource_type: Literal["information_request"]

    ### remove comment from fields after put in fields_definitions.py
    dataset_id                  : Optional[Str]                         # = DATASET_ID_FIELD
    number                      : Optional[Str]                         # = NUMBER_FIELD
    description                 : Optional[Str]                         # = DESCRIPTION_FIELD
    origin                      : Optional[Str]                         # = ORIGIN_FIELD
    url                         : Optional[Str]                         # = URL_FIELD
    department                  : Optional[Str]                         # = DEPARTMENT_FIELD
    opening_date                : Optional[Str]                         # = OPENING_DATE_FIELD
    requested_by                : Optional[RequestedBy]                 # = REQUESTED_BY_FIELD
    spatial_coverage            : Optional[Str]                         # = SPATIAL_COVERAGE_FIELD
    observation_level           : Optional[Set[ObservationLevelEnum]]   # = OBSERVATIONAL_LEVEL_FIELD
    temporal_coverage           : Optional[TemporalCoverageEnum]        # = TEMPORAL_COVERAGE_FIELD
    update_frequency            : Optional[TimeUnitEnum]                # = UPDATE_FREQUENCY_FIELD
    time_unit                   : Optional[TimeUnitEnum]                # = TIME_UNIT_FIELD
    status                      : Optional[StatusEnum]                  # = STATUS_FIELD
    data_url                    : Optional[Str]                         # = DATA_URL_FIELD
    observations                : Optional[Str]                         # = OBSERVATIONS_FIELD
