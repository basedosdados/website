from typing import List, Union, Literal, Any

from pydantic import Field, BaseModel

class TemporalCoverageEnum(BaseModel):
    __root__: List[int] = Field(..., ge=1800, le=2030)

