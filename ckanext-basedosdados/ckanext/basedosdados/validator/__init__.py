import pydantic
from pydantic import ValidationError


class BaseModel(pydantic.BaseModel):
    class Config:
        extra = "allow"


def _treat_scalar_as_single_value_set(cls, value):
    from collections.abc import Iterable

    if value is None:
        return None
    if isinstance(value, str):
        return set([value])
    if isinstance(value, Iterable):
        return set(value)
    return value


def treat_scalar_as_single_value_set(*fields):
    # We need this as ckan coerses single value list as scalars 🤦
    # from:
    # ckan/views/resource.py:185
    # ckan/logic/__init__.py:150
    return pydantic.validator(*fields, pre=True, allow_reuse=True)(
        _treat_scalar_as_single_value_set
    )


# ---------------------------------------------------
# Custom Types Shared between packages and resources
# ---------------------------------------------------

from typing import Optional, Set, List

from pydantic import Field
from pydantic import StrictStr as Str

from ckanext.basedosdados.validator.available_options import (
    CountryEnum,
    EntityEnum,
)

to_line = lambda description: "\n".join(description)

class ObservationLevel(BaseModel):
    # fmt: off
    country : Optional[CountryEnum] = Field(title="País",description=to_line(
        [
            "País da entidade. Deixar nulo se entidade for internacional ou não-espacial.",
            "Opções em 'https://basedosdados.org/api/3/action/bd_available_options'"
        ]
    ))
    entity  : Optional[EntityEnum]  = Field(title="Entidade",description=to_line(
        [
            "Opções em 'https://basedosdados.org/api/3/action/bd_available_options'"
        ]
    ))
    columns : Optional[List[Str]]   = Field(title="Colunas identificadoras",description=to_line(
        [
            "Colunas identificadoras da entidade"
        ]
    ))
    # fmt: on
