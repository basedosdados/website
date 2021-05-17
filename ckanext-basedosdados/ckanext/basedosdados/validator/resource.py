from . import BaseModel
from enum import Enum
from typing import List, Optional, Literal, Union
from pydantic import (
    StrictInt as Int,
    StrictStr as Str,
    Field,
    ValidationError,
    validator,
)
from .package import ID_TYPE


class TemporalCoverageEnum(str, Enum):
    CHECK = "CHECK"  # TODO: data check

    def __init__(self, *args, **kwargs):
        for i in range(1970, 2031):
            setattr(self, i, i)

        super().__init__(*args, **kwargs)


class UpdateFrequencyEnum(str, Enum):
    second = "Second"
    minute = "Minute"
    hour = "Hour"
    day = "Day"
    week = "Week"
    month = "Month"
    quarter = "Quarter"
    semester = "Semester"
    one_year = "One Year"
    two_years = "Two Years"
    three_years = "Three Years"
    four_years = "Four Years"
    five_years = "Five Years"
    ten_years = "Ten Years"
    unique = "Unique"
    recurring = "Recurring"
    empty = "Empty"  # TODO: dahis review
    other = "Other"  # TODO: dahis review


class Resource(BaseModel):
    id: ID_TYPE
    name: Str
    description: Str
    spatial_coverage: Str
    temporal_coverage: List[TemporalCoverageEnum]
    update_frequency: UpdateFrequencyEnum
    # resource_type: str


class LaiRequest(Resource):
    lai_n: int
    resource_type: Literal["lai_request"]


class BdmTable(Resource):
    resource_type: Literal["bdm_table"]
    temporal_coverage: Str  # TODO: List[int]


class ExternalLink(Resource):
    url: str
    resource_type: Literal["external_link"]
