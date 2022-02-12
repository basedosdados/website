from typing import Literal, Optional, Set, List, Union

from ckanext.basedosdados.validator import treat_scalar_as_single_value_set
from ckanext.basedosdados.validator.available_options import (
    StatusEnum,
    TemporalCoverageEnum,
    TimeUnitEnum,
)

from ckanext.basedosdados.validator import SpatialCoverage, ObservationLevel
from ckanext.basedosdados.validator.resources import _CkanDefaultResource
from pydantic import StrictStr as Str

from .fields_definitions import *


class InformationRequest(_CkanDefaultResource):
    resource_type: Literal["information_request"]

    # fmt: off
    origin               : Optional[Str]                     = ORIGIN_FIELD
    number               : Optional[Str]                     = NUMBER_FIELD
    url                  : Optional[Str]                     = URL_FIELD
    department           : Optional[Str]                     = DEPARTMENT_FIELD
    description          : Optional[Str]                     = DESCRIPTION_FIELD
    opening_date         : Optional[Str]                     = OPENING_DATE_FIELD
    requested_by         : Optional[RequestedBy]             = REQUESTED_BY_FIELD
    spatial_coverage     : Optional[List[SpatialCoverage]]   = SPATIAL_COVERAGE_FIELD
    temporal_coverage    : Optional[TemporalCoverageEnum]    = TEMPORAL_COVERAGE_FIELD
    update_frequency     : Optional[TimeUnitEnum]            = UPDATE_FREQUENCY_FIELD
    observation_level    : Optional[List[ObservationLevel]]  = OBSERVATION_LEVEL_FIELD
    status               : Optional[StatusEnum]              = STATUS_FIELD
    data_url             : Optional[Str]                     = DATA_URL_FIELD
    observations         : Optional[Str]                     = OBSERVATIONS_FIELD
    partner_organization : Optional[PartnerOrganization]     = PARTNER_ORGANIZATION_FIELD
    # fmt: on
