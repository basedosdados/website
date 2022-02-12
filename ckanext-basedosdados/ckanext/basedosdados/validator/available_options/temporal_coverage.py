from typing import Any, List, Literal, Union

from pydantic import StrictStr as Str
from pydantic import BaseModel, Field


class TemporalCoverageEnum(BaseModel):
    __root__: List[Str] = Field(...)
