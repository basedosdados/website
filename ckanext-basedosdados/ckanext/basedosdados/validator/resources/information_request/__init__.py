from typing import Literal, Optional, Set, List, Union

from ckanext.basedosdados.validator.available_options.spatial_coverage import SpatialCoverageArea
from ckanext.basedosdados.validator.available_options import (
    StatusEnum,
    TemporalCoverageEnum,
    TimeUnitEnum,
)

from ckanext.basedosdados.validator import ObservationLevel
from ckanext.basedosdados.validator.resources import _CkanDefaultResource

from pydantic import StrictStr as Str, conlist as StrictList
from pydantic import validator

from .fields_definitions import *


class InformationRequest(_CkanDefaultResource):
    resource_type: Literal["information_request"]

    # fmt: off
    origin               : Optional[Str]                                                     = ORIGIN_FIELD
    number               : Optional[Str]                                                     = NUMBER_FIELD
    url                  : Optional[Str]                                                     = URL_FIELD
    department           : Optional[Str]                                                     = DEPARTMENT_FIELD
    description          : Optional[Str]                                                     = DESCRIPTION_FIELD
    opening_date         : Optional[Str]                                                     = OPENING_DATE_FIELD
    requested_by         : Optional[RequestedBy]                                             = REQUESTED_BY_FIELD
    spatial_coverage     : Optional[StrictList(SpatialCoverageArea, min_items=1)]            = SPATIAL_COVERAGE_FIELD
    temporal_coverage    : Optional[TemporalCoverageEnum]                                    = TEMPORAL_COVERAGE_FIELD
    update_frequency     : Optional[TimeUnitEnum]                                            = UPDATE_FREQUENCY_FIELD
    observation_level    : Optional[List[ObservationLevel]]                                  = OBSERVATION_LEVEL_FIELD
    status               : Optional[StatusEnum]                                              = STATUS_FIELD
    data_url             : Optional[Str]                                                     = DATA_URL_FIELD
    observations         : Optional[Str]                                                     = OBSERVATIONS_FIELD
    partner_organization : Optional[PartnerOrganization]                                     = PARTNER_ORGANIZATION_FIELD
    # fmt: on
