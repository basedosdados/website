from ckanext.basedosdados.validator.package import Package, ValidationError
import jsonschema

import pytest
from pytest import raises

@pytest.fixture()
def data():
    return {
        'id': '123'
        ,'resources': [{}]
        ,'temporal_coverage': [2020]
    }

def test_validating(data):
    with raises(ValidationError) as e:
        Package.validate(data)
    assert e.match("Discriminator 'resource_type' is missing in value")

def test_correct_reporting_on_missing_properties_of_a_specific_resource(data):
    data['resources'] = [{'resource_type': 'external_link', 'id': '13', 'name': 'linkzao', 'surl': ''}]
    with raises(ValidationError) as e:
        Package.validate(data)
    assert e.value.errors() == [{'loc': ('resources', 0, 'ExternalLink', 'url'), 'msg': 'field required', 'type': 'value_error.missing'}]

def test_ok(data):
    data['resources'] = [{'resource_type': 'external_link', 'id':'13', 'name': 'linkzao', 'url': 'fgdfg'}]
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
