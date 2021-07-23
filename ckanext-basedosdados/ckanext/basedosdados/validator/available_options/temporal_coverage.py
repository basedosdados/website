from typing import List, Union, Literal

from pydantic import Field, BaseModel

class TemporalCoverageInt(BaseModel):
    __root__: int = Field(..., ge=1800, le=2030)

TemporalCoverageEnum = List[Union[TemporalCoverageInt, Literal["CHECK"]]]
