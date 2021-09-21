from typing import Optional, Set
from datetime import datetime

from ckanext.basedosdados.validator import BaseModel
from pydantic import Field
from pydantic import StrictStr as Str

# -------------------------------------
# Custom Types shared between bdm
# -------------------------------------


class LastUpdated(BaseModel):
    # fmt: off
    metadata: Optional[datetime]  = Field(title="Metadados",user_input_hint=["Última atualização: metadados"])
    data     : Optional[datetime] = Field(title="Dados",user_input_hint=["Última atualização: dados"])
    release  : Optional[datetime] = Field(title="Dados Originais",user_input_hint=["Último lançamento: dados originais"])
    # fmt: on


class PublishedBy(BaseModel):
    # fmt: off
    name        : Optional[Str] = Field(title="Nome",user_input_hint=["<nome [você]>"])
    email       : Optional[Str] = Field(title="Email",user_input_hint=["<email>"])
    github_user : Optional[Str] = Field(title="Usuário Github",user_input_hint=["<usuário Github>"])
    website     : Optional[Str] = Field(title="Website",user_input_hint=["<www.exemplo.com>"])
    ckan_user   : Optional[Str] = Field(title="Usuário CKAN",user_input_hint=["<id do usuário no ckan>"])
    # fmt: on
