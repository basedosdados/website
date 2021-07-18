
from typing import Optional, Literal, Set

from pydantic import (
    StrictStr as Str,
    Field,
)

from ckanext.basedosdados.validator import treat_scalar_as_single_value_set
from ckanext.basedosdados.validator.resources import _CkanDefaultResource
from ckanext.basedosdados.validator.available_options import (
    TemporalCoverage,
    UpdateFrequencyEnum,
    LanguageEnum,
    AvailabilityEnum,
    YES_NO,
)
class Resource(_CkanDefaultResource):
    spatial_coverage : Optional[Str]                  # Required for tier 1
    temporal_coverage: Optional[TemporalCoverage]     # Required for tier 1
    update_frequency : Optional[UpdateFrequencyEnum]  # Required for tier 1


class ExternalLink(Resource): 
    resource_type: Literal["external_link"]

    url          : str                                                  # Required for tier 1 # TODO                                                : add check_url_is_alive validator check is url
    language     : Optional[Set[LanguageEnum]] = Field(max_items = 10)  # Required for tier 1 # TODO: @dahis, serio q eh so no external link ?
    has_api      : Optional[YES_NO]                                     # Required for tier 1 # TODO                                   : data check
    free         : Optional[YES_NO]                                     # Required for tier 1
    signup_needed: Optional[YES_NO]                                     # Required for tier 1
    availability : Optional[AvailabilityEnum]                           # Required for tier 1
    brazilian_ip : Optional[YES_NO]                                     # Required for tier 1
    license_type : Optional[Str]                                        # Required for tier 1

    _language_validator = treat_scalar_as_single_value_set("language")
