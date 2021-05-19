from typing_extensions import Annotated
from typing import Optional

from pydantic import StrictInt as Int, Field, StrictStr as Str

from .observations import ObservationLevel

IdType = Annotated[
    Optional[Str], Field()
]  # TODO: would be nice to require on show/update but not on create

TemporalCoverage = Annotated[int, Field(ge=1970, le=2030)]