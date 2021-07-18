from typing_extensions import Annotated
from typing import Optional, List, Union, Literal

from pydantic import Field, StrictStr as Str, BaseModel

# -------------------------------------
# MODULE OPTIONS
# -------------------------------------
from .observations import ObservationLevel
from .update_frequency import UpdateFrequencyEnum
from .availability import AvailabilityEnum
from .status import StatusEnum
from .language import LanguageEnum

# -------------------------------------
# NEW OPTIONS
# -------------------------------------
YES_NO = Literal["yes", "no"]

IdType = Annotated[Optional[Str], Field()]  # TODO: would be nice to require on show/update but not on create


class TemporalCoverageInt(BaseModel):
    __root__: int = Field(..., ge=1970, le=2030)

TemporalCoverage = List[Union[TemporalCoverageInt, Literal["CHECK"]]]
