from typing import Literal, Optional, Set, Union

from ckanext.basedosdados.validator import treat_scalar_as_single_value_set
from ckanext.basedosdados.validator.available_options import (
    AvailabilityEnum,
    CountryEnum,
    EntityEnum,
    LanguageEnum,
    LicenseEnum,
    TemporalCoverageEnum,
    TimeUnitEnum,
    YesNoEnum,
)

from ckanext.basedosdados.validator import SpatialCoverage
from ckanext.basedosdados.validator.resources import _CkanDefaultResource
from pydantic import StrictStr as Str

from .fields_definitions import *


class ExternalLink(_CkanDefaultResource):
    resource_type: Literal["external_link"]

    # External Link models
    # fmt: off
    dataset_id                  : Optional[Str]                                  = DATASET_ID_FIELD
    url                         : Optional[Str]                                  = URL_FIELD
    title                       : Optional[Str]                                  = TITLE_FIELD
    description                 : Optional[Str]                                  = DESCRIPTION_FIELD
    language                    : Optional[Set[LanguageEnum]]                    = LANGUAGE_FIELD # Field(max_items = 10)
    has_structured_data         : Optional[YesNoEnum]                            = HAS_STRUCTURED_DATA_FIELD
    has_api                     : Optional[YesNoEnum]                            = HAS_API_FIELD
    is_free                     : Optional[YesNoEnum]                            = IS_FREE_FIELD
    requires_registration       : Optional[YesNoEnum]                            = REQUIRES_REGISTRATION_FIELD
    availability                : Optional[AvailabilityEnum]                     = AVAILABILITY_FIELD
    country_ip_address_required : Optional[Set[CountryEnum]]                     = COUNTRY_IP_ADDRESS_REQUIRED_FIELD
    license                     : Optional[LicenseEnum]                          = LICENSE_FIELD
    spatial_coverage            : Union[Optional[SpatialCoverage],Optional[Str]] = SPATIAL_COVERAGE_FIELD # TODO: remove Optional[Str] after migration
    temporal_coverage           : Optional[TemporalCoverageEnum]                 = TEMPORAL_COVERAGE_FIELD
    update_frequency            : Optional[TimeUnitEnum]                         = UPDATE_FREQUENCY_FIELD
    entity                      : Optional[Set[EntityEnum]]                      = ENTITY_FIELD
    time_unit                   : Optional[TimeUnitEnum]                         = TIME_UNIT_FIELD
    # fmt: on

    # -------------------------------------
    # VALIDATORS
    # -------------------------------------
    _language_validator = treat_scalar_as_single_value_set("language")
