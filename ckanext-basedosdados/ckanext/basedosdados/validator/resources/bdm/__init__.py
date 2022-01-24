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
    metadata : Optional[Str] = Field(title="Metadados")
    data     : Optional[Str] = Field(title="Dados")
    release  : Optional[Str] = Field(title="Dados Originais")
    # fmt: on


class PublishedBy(BaseModel):
    # fmt: off
    name        : Optional[Str] = Field(title="Nome")
    email       : Optional[Str] = Field(title="Email")
    github_user : Optional[Str] = Field(title="Usuário Github")
    ckan_user   : Optional[Str] = Field(title="Usuário CKAN")
    website     : Optional[Str] = Field(title="Website")
    # fmt: on


class PartnerOrganization(BaseModel):
    # fmt: off
    name            : Optional[Str] = Field(title="Nome",description=to_line(["Nome completo"]))
    organization_id : Optional[Str] = Field(title="ID Organização",description=to_line(["ID Organização - CKAN"]))
    # fmt: on
