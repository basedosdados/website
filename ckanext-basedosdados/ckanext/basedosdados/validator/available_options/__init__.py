from typing_extensions import Annotated
from typing import Optional, List, Union, Literal

from pydantic import Field, StrictStr as Str, BaseModel

# -------------------------------------
# MODULE OPTIONS
# -------------------------------------
from .observation_level import ObservationLevelEnum
from .spacial_coverage import SpacialCoverageEnum
from .time_unit import TimeUnitEnum
from .availability import AvailabilityEnum
from .status import StatusEnum
from .language import LanguageEnum
from .yes_no import YesNoEnum
from .country import CountryEnum
from .license import LicenseEnum
from .bigquery_type import BigQueryTypeEnum

# -------------------------------------
# NEW OPTIONS
# -------------------------------------
YES_NO = Literal["yes", "no"]

IdType = Annotated[Optional[Str], Field()]  # TODO: would be nice to require on show/update but not on create


class TemporalCoverageInt(BaseModel):
    __root__: int = Field(..., ge=1970, le=2030)

TemporalCoverageEnum = List[Union[TemporalCoverageInt, Literal["CHECK"]]]
