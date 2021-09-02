from datetime import datetime
from pydantic import StrictStr as Str, Extra, Field
from typing import Optional

from ckanext.basedosdados.validator import BaseModel
from ckanext.basedosdados.validator.available_options import IdType


### Do not use extra while creating new models
class _CkanDefaultResource(BaseModel):  # , extra=Extra.forbid):
    # fmt: off
    id                 : IdType
    
    name               : Str                              = Field(title="Nome")
    description        : Str                              = Field(title="Descrição")
    position           : int                              = Field(title="Posição")
    url                : Optional[str]                    = Field(title="URL") # reserved in ckan 
    cache_last_updated : Optional[datetime]               = Field(title="Última Atualização do Cache")
    cache_url          : Optional[Str]                    = Field(title="Url Cache")
    created            : Optional[datetime]               = Field(title="Data de Criação")
    datastore_active   : Optional[bool]                   = Field(title="Datastore Ativa")
    format             : Optional[Str]                    = Field(title="Formato")
    hash               : Optional[Str]                    = Field(title="Hash")
    last_modified      : Optional[datetime]               = Field(title="Data da Útima Atualização")
    metadata_modified  : Optional[datetime]               = Field(title="Data de Modificação")
    mimetype           : Optional[Str]                    
    mimetype_inner     : Optional[Str]                    
    package_id         : Optional[Str]                    
    size               : Optional[float]                  
    state              : Optional[Str]                    = Field(title="Estado")
    url_type           : Optional[Str]                    
