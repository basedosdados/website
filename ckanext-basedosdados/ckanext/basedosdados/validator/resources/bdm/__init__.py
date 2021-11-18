from typing import Optional, Set
from datetime import datetime

from ckanext.basedosdados.validator import BaseModel
from pydantic import Field
from pydantic import StrictStr as Str

# -------------------------------------
# Custom Types shared between bdm
# -------------------------------------

to_line = lambda description: "\n".join(description)

class LastUpdated(BaseModel):
    # fmt: off
    metadata: Optional[datetime]  = Field(title="Metadados",description=to_line(["Última atualização: metadados"]))
    data     : Optional[datetime] = Field(title="Dados",description=to_line(["Última atualização: dados"]))
    release  : Optional[datetime] = Field(title="Dados Originais",description=to_line(["Último lançamento: dados originais"]))
    # fmt: on


class PublishedBy(BaseModel):
    # fmt: off
    name        : Optional[Str] = Field(title="Nome",description=to_line(["<nome [você]>"]))
    email       : Optional[Str] = Field(title="Email",description=to_line(["<email>"]))
    github_user : Optional[Str] = Field(title="Usuário Github",description=to_line(["<usuário Github>"]))
    website     : Optional[Str] = Field(title="Website",description=to_line(["<www.exemplo.com>"]))
    ckan_user   : Optional[Str] = Field(title="Usuário CKAN",description=to_line(["<id do usuário no ckan>"]))
    # fmt: on
