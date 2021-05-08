#!/usr/bin/env python3
from __future__ import annotations
from datetime import datetime
from typing import List, Optional, Literal, Union
import pydantic
from pydantic import BaseModel, StrictInt as Int, Field, ValidationError, validator
import jsonschema

from typing_extensions import Annotated # migrate to py3.9

class Resource(BaseModel):
    id: str
    name: str
    # resource_type: str

    @validator('id')
    def id_must_be_big(cls, v):
        assert v > 10
        return v

class LaiRequest(Resource):
    lai_n: int
    resource_type: Literal['lai_request']

class ExternalLink(Resource):
    url: str
    fred: int
    resource_type: Literal['external_link']

AnyResource = Annotated[Union[LaiRequest, ExternalLink], Field(discriminator='resource_type')]
class Package(BaseModel):
    id: int
    temporal_coverage: List[int]
    resources: List[AnyResource]





##############

# import pytest
# from pytest import raises
# 
# @pytest.fixture()
def data():
    return {
        'id': 123
        ,'resources': [{}]
        ,'temporal_coverage': [2020]
    }

def test_validating(data):
    with raises(ValidationError) as e:
        Package.validate(data)
    assert e.match("Discriminator 'resource_type' is missing in value")

def test_correct_reporting_on_missing_properties_of_a_specific_resource(data):
    data['resources'] = [{'resource_type': 'external_link', 'id':13, 'name': 'linkzao', 'surl': ''}]
    with raises(ValidationError) as e:
        Package.validate(data)
    assert e.value.errors() == [{'loc': ('resources', 0, 'ExternalLink', 'url'), 'msg': 'field required', 'type': 'value_error.missing'}]

def test_ok(data):
    data['resources'] = [{'resource_type': 'external_link', 'id':13, 'name': 'linkzao', 'url': 'fgdfg'}]
    out = Package.validate(data)
    jsonschema.validate(data, Package.schema())
    assert out.dict() == data




if __name__ == '__main__':
    class A(BaseModel):
        __root__ : AnyResource

    from jsonref import JsonRef, json
    print(json.dumps(
        JsonRef.replace_refs(LaiRequest.schema(), jsonschema=True)
    ,indent=2))
