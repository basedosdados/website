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

from typing import Optional, Set

from pydantic import Field
from pydantic import StrictStr as Str

from ckanext.basedosdados.validator.available_options import (
    Admin1Enum,
    Admin2Enum,
    ContinentEnum,
    CountryEnum,
)

to_line = lambda description: "\n".join(description)

class SpatialCoverage(BaseModel):
    # TODO definir campo complexo de spatial_coverage
    # 1. ler os dataframes de diretorios para estrurar árvore de dicts e metadados
    # incluir IDs de entidades e nomes
    # 2. transformar isso num dict para front-end
    # fmt: off
    continent: Optional[Set[ContinentEnum]] = Field(title="Continente", description=to_line(["Continente"]))
    country  : Optional[Set[CountryEnum]]   = Field(title="País",description=to_line(["País"]))
    admin1   : Optional[Set[Admin1Enum]]    = Field(title="UF/Estado",description=to_line(["UF/Estado"]))
    admin2   : Optional[Set[Admin2Enum]]    = Field(title="Município/Condado",description=to_line(["Município/Condado"]))
    #         admin3    : Optional[Str]     = Field(description=to_line(["Distrito"]))
    # fmt: on
