from ckanext.basedosdados.validator import BaseModel
from typing import Optional
from datetime import datetime
from pydantic import (
    StrictStr as Str,
    Extra
)
from ckanext.basedosdados.validator.available_options import IdType

### Do not use extra while creating new models
class _CkanDefaultResource(BaseModel):
    id                 : IdType
    name               : Str
    description        : Str
    position           : int
    url                : Optional[str] # reserved in ckan
    cache_last_updated : Optional[datetime]
    cache_url          : Optional[Str]
    created            : Optional[datetime]
    datastore_active   : Optional[bool]
    format             : Optional[Str]
    formato            : Optional[Str]
    hash               : Optional[Str]
    last_modified      : Optional[datetime]
    metadata_modified  : Optional[datetime]
    mimetype           : Optional[Str]
    mimetype_inner     : Optional[Str]
    package_id         : Optional[Str]
    size               : Optional[float]
    state              : Optional[Str]
    url_type           : Optional[Str]