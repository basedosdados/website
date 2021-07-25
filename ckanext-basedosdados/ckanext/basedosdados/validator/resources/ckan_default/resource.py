from ckanext.basedosdados.validator import BaseModel
from typing import Optional
from pydantic import (
    StrictStr as Str,
    Extra
)
from ckanext.basedosdados.validator.available_options import IdType


class _CkanDefaultResource(BaseModel, extra=Extra.forbid):
    id         : IdType
    name       : Str
    description: Str
    position   : int
    url        : Optional[str] # reserved in ckan
