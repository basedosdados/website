from typing import Any, List, Literal, Union

from pydantic import BaseModel, Field


class TemporalCoverageEnum(BaseModel):
    __root__: List[int] = Field(..., ge=-10000, le=2200)
