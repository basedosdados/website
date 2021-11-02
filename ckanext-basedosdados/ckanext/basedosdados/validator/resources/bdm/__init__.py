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
    metadata : Optional[datetime] = Field(title="Metadados",description=["Última atualização: metadados"])
    data     : Optional[datetime] = Field(title="Dados",description=["Última atualização: dados"])
    release  : Optional[datetime] = Field(title="Dados Originais",description=["Último lançamento: dados originais"])
    # fmt: on


class PublishedBy(BaseModel):
    # fmt: off
    name        : Optional[Str] = Field(title="Nome",description=["<nome [você]>"])
    email       : Optional[Str] = Field(title="Email",description=["<email>"])
    github_user : Optional[Str] = Field(title="Usuário Github",description=["<usuário Github>"])
    ckan_user   : Optional[Str] = Field(title="Usuário CKAN",description=["<id do usuário no ckan>"])
    website     : Optional[Str] = Field(title="Website",description=["<www.exemplo.com>"])
    # fmt: on
