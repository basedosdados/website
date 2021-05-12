#!/usr/bin/env python3
from __future__ import annotations
from datetime import datetime
from typing import List, Optional, Literal, Union
import pydantic
from pydantic import BaseModel, StrictInt as Int, StrictStr as Str, Field, ValidationError, validator
import jsonschema

from typing_extensions import Annotated # migrate to py3.9
A = Annotated
F = Field

class Resource(BaseModel):
    id: A[Str, F()]
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

AnyResource = Annotated[Union[LaiRequest, ExternalLink, BdmTable], Field(discriminator='resource_type')]
class Package(BaseModel):
    id: Str
    resources: List[AnyResource]

