from . import BaseModel
from typing import List, Optional, Literal, Union
from pydantic import StrictInt as Int, StrictStr as Str, Field, ValidationError, validator
from .package import ID_TYPE

RESOURCE_TYPES = ['lai_request', 'bdm_table', 'external_link'] # TODO: add something that test that subclasses obey this constant

class Resource(BaseModel):
    id: ID_TYPE
    name: str
    position: int
    # position: str # needs to be a string with int value because of ckan. Vali
    url: Optional[str] # reserved in ckan

    #@validator('position')
    def position_should_be_an_integer_string(cls, value):
        return f'{int(value):02}'

class LaiRequest(Resource):
    resource_type: Literal['lai_request']

    lai_n: int

class BdmTable(Resource):
    resource_type: Literal['bdm_table']

    temporal_coverage: Str # TODO: List[int]

class ExternalLink(Resource):
    resource_type: Literal['external_link']

    link_url: str

