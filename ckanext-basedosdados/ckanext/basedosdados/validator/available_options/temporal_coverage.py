import datetime
from typing import Any, List, Literal, Union

from pydantic import StrictStr as Str, StrictInt as Int, conlist as ConstrainedList, conint as ConstrainedInt
from pydantic import BaseModel, Field
import pydantic
import datetime


class _DateList(BaseModel):
    __root__: ConstrainedList(Int, min_items=1, max_items=3)

    @pydantic.validator("__root__")
    def check_date_string_syntax(cls, value):
        """This array can be just a year [2021] or a year-month [2021, 4] or year-month-day [2021, 4, 1]"""
        padding = [1 for i in range(3 - len(value))]
        datetime.date(*(value + padding))  # throw ValueError on error
        return value


class _TemporalRange(BaseModel):
    """Exemplo: {'start': [2001, 1, 3], 'end': 'inherit', 'step':1}"""

    start: _DateList
    end: Union[_DateList, Literal["inherit"]]
    step: ConstrainedInt(ge=1)


class _DateList(BaseModel):
    __root__: ConstrainedList(Int, min_items=1, max_items=3)

    @pydantic.validator('__root__')
    def check_date_string_syntax(cls, value):
        ''' This array can be just a year [2021] or a year-month [2021, 4] or year-month-day [2021, 4, 1] '''
        padding = [1 for i in range(3-len(value))]
        datetime.date(*(value + padding)) # throw ValueError on error
        return value

class _TemporalRange(BaseModel):
    ''' Exemplo: {'start': [2001, 1, 3], 'end': 'inherit', 'step':1}'''
    start: _DateList
    end: Union[_DateList, Literal['inherit']]
    step: ConstrainedInt(ge=1)

class TemporalCoverageEnum(BaseModel):
    __root__: List[_TemporalRange] = Field(...)

    # TODO: add a validator to guarantee ranges dont overlap

class TemporalCoverageEnum(BaseModel): # TODO: delete this
    __root__: List[str] = Field(...)
    ''' 2012(1)2015 '''
