from ckanext.basedosdados.validator import BaseModel
from typing import Optional
from datetime import datetime
from pydantic import (
    StrictStr as Str,
    Extra,
    Field
)
from ckanext.basedosdados.validator.available_options import IdType

### Do not use extra while creating new models
class _CkanDefaultResource(BaseModel): #, extra=Extra.forbid):
    id                 : IdType
    name               : Str                              = Field(title="Nome")
    description        : Str                              = Field(title="Descrição")
    position           : int                              = Field(title="Posição")
    url                : Optional[str]                    = Field(title="URL") # reserved in ckan 
    cache_last_updated : Optional[datetime]               
    cache_url          : Optional[Str]                    
    created            : Optional[datetime]               
    datastore_active   : Optional[bool]                   
    format             : Optional[Str]                    
    formato            : Optional[Str]                    
    hash               : Optional[Str]                    
    last_modified      : Optional[datetime]               = Field(title="Útima atualização")
    metadata_modified  : Optional[datetime]               = Field(title="Data de Modificação")
    mimetype           : Optional[Str]                    
    mimetype_inner     : Optional[Str]                    
    package_id         : Optional[Str]                    
    size               : Optional[float]                  
    state              : Optional[Str]                    
    url_type           : Optional[Str]                    