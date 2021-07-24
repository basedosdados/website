from typing import Optional, Literal, Set

from pydantic import (
    StrictStr as Str,
    Field,
)

from .fields_definitions import *
from ckanext.basedosdados.validator.resources import _CkanDefaultResource
from ckanext.basedosdados.validator import treat_scalar_as_single_value_set
from ckanext.basedosdados.validator.available_options import (
    TemporalCoverageEnum,
    EntityEnum,
    TimeUnitEnum,
    LanguageEnum,
    AvailabilityEnum,
    YesNoEnum,
    CountryEnum,
    LicenseEnum
)


class ExternalLink(_CkanDefaultResource): 
    resource_type: Literal["external_link"]

    # External Link models
    dataset_id                  : Optional[Str]                  = DATASET_ID_FIELD
    url                         : Optional[Str]                  = URL_FIELD
    title                       : Optional[Str]                  = TITLE_FIELD
    description                 : Optional[Str]                  = DESCRIPTION_FIELD
    language                    : Optional[Set[LanguageEnum]]    = LANGUAGE_FIELD # Field(max_items = 10)
    has_structured_data         : Optional[YesNoEnum]            = HAS_STRUCTURED_DATA_FIELD
    has_api                     : Optional[YesNoEnum]            = HAS_API_FIELD
    is_free                     : Optional[YesNoEnum]            = IS_FREE_FIELD
    requires_registration       : Optional[YesNoEnum]            = REQUIRES_REGISTRATION_FIELD
    availability                : Optional[AvailabilityEnum]     = AVAILABILITY_FIELD
    country_ip_address_required : Optional[Set[CountryEnum]]     = COUNTRY_IP_ADDRESS_REQUIRED_FIELD
    license                     : Optional[LicenseEnum]          = LICENSE_FIELD
    spatial_coverage            : Optional[Str]                  = SPATIAL_COVERAGE_FIELD # TODO: put spatial_covaerage SpacialCoverageEnum after defning in avaliable_options.py
    temporal_coverage           : Optional[TemporalCoverageEnum] = TEMPORAL_COVERAGE_FIELD
    update_frequency            : Optional[TimeUnitEnum]         = UPDATE_FREQUENCY_FIELD
    observation_level           : Optional[Set[EntityEnum]]      = ENTITY_FIELD
    time_unit                   : Optional[TimeUnitEnum]         = TIME_UNIT_FIELD

    # -------------------------------------
    # VALIDATORS
    # -------------------------------------
    _language_validator = treat_scalar_as_single_value_set("language")
