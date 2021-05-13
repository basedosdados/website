from . import BaseModel
from typing import List, Optional, Literal, Union
from pydantic import StrictInt as Int, StrictStr as Str, Field, ValidationError, validator
from .package import ID_TYPE

class Resource(BaseModel):
    id: ID_TYPE
    name: str
    # resource_type: str

class LaiRequest(Resource):
    lai_n: int
    resource_type: Literal['lai_request']

class BdmTable(Resource):
    resource_type: Literal['bdm_table']
    temporal_coverage: Str # TODO: List[int]

class ExternalLink(Resource):
    url: str
    resource_type: Literal['external_link']

