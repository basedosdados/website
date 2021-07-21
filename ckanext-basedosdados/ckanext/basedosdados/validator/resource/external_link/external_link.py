
from typing import Optional, Literal, Set

from pydantic import (
    StrictStr as Str,
    Field,
)

from ckanext.basedosdados.validator import treat_scalar_as_single_value_set
from ckanext.basedosdados.validator.resource import _CkanDefaultResource
from ckanext.basedosdados.validator.available_options import (
    SpatialCoverage,
    ObservationLevelEnum,
    TemporalCoverage,
    TimeUnitEnum,
    LanguageEnum,
    AvailabilityEnum,
    YesNoEnum,
    CountryEnum,
    LicenseEnum
)

class ExternalLink(_CkanDefaultResource): 
    resource_type: Literal["external_link"]

    dataset_id                  : Str                                   = DATASET_ID_FIELD
    url                         : Optional[Str]                         = URL_FIELD
    description                 : Optional[Str]                         = DESCRIPTION_FIELD
    language                    : Optional[Set[LanguageEnum]]           = LANGUAGE_FIELD # Field(max_items = 10)
    has_structured_data         : Optional[set[YesNoEnum]]              = HAS_STRUCTURED_DATA_FIELD                     
    has_api                     : Optional[set[YesNoEnum]]              = HAS_API_FIELD
    is_free                     : Optional[set[YesNoEnum]]              = IS_FREE_FIELD
    requires_registration       : Optional[set[YesNoEnum]]              = REQUIRES_REGISTRATION_FIELD
    availability                : Optional[set[AvailabilityEnum]]       = AVAILABILITY_FIELD
    country_ip_address_required : Optional[set[CountryEnum]]            = COUNTRY_IP_ADDRESS_REQUIRED_FIELD
    license                     : Optional[set[LicenseEnum]]            = LICENSE_FIELD                     
    spatial_coverage            : Optional[SpatialCoverage]             = SPATIAL_COVERAGE_FIELD
    observation_level           : Optional[set[ObservationLevelEnum]]   = OBSERVATIONAL_LEVEL_FIELD
    temporal_coverage           : Optional[TemporalCoverage]            = TEMPORAL_COVERAGE_FIELD
    update_frequency            : Optional[set[TimeUnitEnum]]           = UPDATE_FREQUENCY_FIELD
    time_unit                   : Optional[set[TimeUnitEnum]]           = TIME_UNIT_FIELD

    _language_validator = treat_scalar_as_single_value_set("language")
