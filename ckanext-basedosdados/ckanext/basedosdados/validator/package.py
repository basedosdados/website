#!/usr/bin/env python3
from __future__ import annotations
from datetime import datetime
from typing import List, Optional, Literal, Union
import pydantic
from pydantic import StrictInt as Int, StrictStr as Str, Field, ValidationError, validator, PrivateAttr
import jsonschema

Missing = type(None)

from typing_extensions import Annotated # migrate to py3.9
A = Annotated
F = Field
ID_TYPE = A[Union[Str, Missing], F()] # TODO: would be nice to require on show/update but not on create

class BaseModel(pydantic.BaseModel):
    class Config:
        extra = 'allow'

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

AnyResource = Annotated[Union[LaiRequest, ExternalLink, BdmTable], Field(discriminator='resource_type')]
class Package(BaseModel):

    id: ID_TYPE
    resources: List[AnyResource]
    fred: Optional[Int]

    action__: Optional[Literal['package_show', 'package_create', 'package_update']]


    @validator('action__')
    def ids_should_respect_action(cls, value, config, values, field):
        action = value
        if not action: return
        if action in ('package_update', 'package_show'):
            assert values['id'] != None, 'package id is None'
            for idx, r in enumerate(values['resources']):
                assert r.id != None, f"resource {idx!r} id is None"
        elif action == 'package_create':
            assert values['id'] == None, 'package id is None'
            for idx, r in enumerate(values['resources']):
                assert r.id == None, f"resource #{idx!r} id field not is None: {r.id!r}"
        return
