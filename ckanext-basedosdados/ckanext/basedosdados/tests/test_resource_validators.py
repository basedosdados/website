from ckanext.basedosdados.validator.package import Package
from ckanext.basedosdados.validator.resource import Resource, BdmTable, ExternalLink
import jsonschema
import pytest

from . import data


def jsonify(data):
    from pydantic.json import pydantic_encoder
    import json

    return json.loads(json.dumps(data, default=pydantic_encoder))


def test_resource():
    data = {
        "id": "2251834b-0359-49d1-b2e2-ce791d75bdd1",
        "name": "Baixar",
        "description": "",
        "spatial_coverage": "spatial",
        "temporal_coverage": [2001, 2002, 2003, 2004, 2005],
        "update_frequency": "second",
        "position": 1
    }

    out = Resource.validate(data)
    out = out.dict(exclude={"action__"})
    out = jsonify(out)
    jsonschema.validate(jsonify(data), Resource.schema())
    for k, v in data.items():  # assert data is a subsed of out.dict()
        assert out[k] == v


def test_bdm_table():
    data = {
        "id": "2251834b-0359-49d1-b2e2-ce791d75bdd1",
        "name": "Baixar",
        "description": "",
        "spatial_coverage": "spatial",
        "position": 1,
        "temporal_coverage": [2001, 2002, 2003, 2004, 2005],
        "update_frequency": "second",
        "table_id": 10,
        "auxiliary_files_url": "www.files.com.br/files-test",
        "observation_level": ["dam", "gun", "age"],
        "columns": "",
        "primary_keys": "jasdiasd",
        "version": "3.0.0",
        "publisher": "Test",
        "publisher_email": "test@teste.com",
        "publisher_github": "",
        "publisher_website": "www.teste.com.br",
        "resource_type": "bdm_table",
    }

    out = BdmTable.validate(data)
    out = out.dict(exclude={"action__"})
    out = jsonify(out)
    jsonschema.validate(jsonify(data), BdmTable.schema())
    for k, v in data.items():  # assert data is a subsed of out.dict()
        assert out[k] == v


def test_external_link():
    data = {
        "id": "2251834b-0359-49d1-b2e2-ce791d75bdd1",
        "name": "Baixar",
        "description": "",
        "url": "www.teste.com.br",
        "spatial_coverage": "spatial",
        "position": 1,
        "temporal_coverage": [2001, 2002, 2003, 2004, 2005],
        "update_frequency": "second",
        "language": ["german", "bahasa", "urdu"],
        "has_api": "yes",
        "free": "no",
        "signup_needed": "yes",
        "availability": "online",
        "brazilian_ip": "no",
        "license_type": "MIT",
        "resource_type": "external_link",
    }

    out = ExternalLink.validate(data)
    out = out.dict(exclude={"action__"})
    out = jsonify(out)
    jsonschema.validate(jsonify(data), ExternalLink.schema())
    for k, v in data.items():  # assert data is a subsed of out.dict()
        assert out[k] == v


def test_ok(data):
    data["resources"] = [
        {
            "id": "2251834b-0359-49d1-b2e2-ce791d75bdd1",
            "name": "Baixar",
            "description": "",
            "spatial_coverage": "spatial",
            "position": 1,
            "temporal_coverage": [2001, 2002, 2003, 2004, 2005],
            "update_frequency": "second",
            "table_id": 10,
            "auxiliary_files_url": "www.files.com.br/files-test",
            "observation_level": ["dam", "gun", "age"],
            "columns": "",
            "primary_keys": "jasdiasd",
            "version": "3.0.0",
            "publisher": "Test",
            "publisher_email": "test@teste.com",
            "publisher_github": "",
            "publisher_website": "www.teste.com.br",
            "resource_type": "bdm_table",
        },
        {
            "id": "2251834b-0359-49d1-b2e2-ce791d75bdd1",
            "name": "Baixar",
            "description": "",
            "url": "www.teste.com.br",
            "position": 1,
            "spatial_coverage": "spatial",
            "temporal_coverage": [2001, 2002, 2003, 2004, 2005],
            "update_frequency": "second",
            "language": ["german", "bahasa", "urdu"],
            "has_api": "yes",
            "free": "no",
            "signup_needed": "yes",
            "availability": "online",
            "brazilian_ip": "no",
            "license_type": "MIT",
            "resource_type": "external_link",
        },
    ]
    out = Package(**data, action__='package_show')
    out = out.dict(exclude={"action__"}, exclude_unset=True)
    out = jsonify(out)
    jsonschema.validate(jsonify(data), Package.schema())
    for k, v in data.items():  # assert data is a subsed of out.dict()
        assert out[k] == v