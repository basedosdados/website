# from ckanext.basedosdados.validator.package import Package, ValidationError
# from ckanext.basedosdados.validator.resource import Resource, BdmTable, ExternalLink
from ckanext.basedosdados.validator.bdm.dataset import BdmDataset, ValidationError
from ckanext.basedosdados.validator.bdm.table import BdmTable, Resource
from ckanext.basedosdados.validator.external_link.table import ExternalLink

import jsonschema

import pytest
from pytest import raises

from . import data


def jsonify(data):
    from pydantic.json import pydantic_encoder
    import json

    return json.loads(json.dumps(data, default=pydantic_encoder))


def test_validating(data):
    with raises(ValidationError) as e:
        BdmDataset.validate(data)
    assert e.match("Discriminator 'resource_type' is missing in value")


def test_correct_reporting_on_missing_properties_of_a_specific_resource(data):
    data["resources"] = [
        {"resource_type": "external_link", "id": "13", "name": "linkzao"}
    ]
    with raises(ValidationError) as e:
        BdmDataset(**data, action__='package_show')
    for error in e.value.errors():
        assert error['type'] == "value_error.missing", error


# TODO @Fred: See if this test is needed and remove request
@pytest.mark.skip()
def test_ckanize():
    master_dataset = {
        "ano": ["atual"],
        "api": "nao",
        "author": None,
        "author_email": None,
        "autor": "",
        "autor_email": "",
        "coleta": "projeto",
        "creator_user_id": "27eaffe3-f79b-469f-8f02-4716146bdfcc",
        "disponibilidade": "online",
        "download_type": "Link Externo",
        "estado": "vazio",
        "gratis": "sim",
        "id": "fb7af1b7-8169-46d3-93ae-a4e2ac2a46fa",
        "idioma": ["ingles"],
        "ip_brasileiro": "nao",
        "isopen": False,
        "license_id": None,
        "license_title": None,
        "maintainer": None,
        "maintainer_email": None,
        "mantenedor": "",
        "mantenedor_email": "",
        "metadata_created": "2020-08-26T17:02:38.517037",
        "metadata_modified": "2020-08-26T17:03:31.181690",
        "microdados": "sim",
        "name": "list-of-dirty-naughty-obscene-and-otherwise-bad-words",
        "nivel_observacao": ["outro"],
        "notes": "Com milhões de imagens em nossa biblioteca e bilhões de palavras-chave enviadas por usuários, trabalhamos duro na Shutterstock para garantir que palavrões não apareçam em lugares que não deveriam. Este repo contém uma lista de palavras que usamos para filtrar resultados de nosso servidor de preenchimento automático e mecanismo de recomendação.\r\n\r\nAviso óbvio: essas listas contêm material que muitos considerarão ofensivo. (Mas esse é o ponto!)",
        "num_resources": 1,
        "num_tags": 3,
        "organization": {
            "id": "f9157f9b-1797-4bdb-a390-758ac5a12ca8",
            "name": "shutterstock",
            "title": "Shutterstock",
            "type": "organization",
            "description": "www.shutterstock.com",
            "image_url": "2020-08-26-165941.867765246x0w.png",
            "created": "2020-08-26T16:59:42.740591",
            "is_organization": True,
            "approval_status": "approved",
            "state": "active",
        },
        "owner_org": "f9157f9b-1797-4bdb-a390-758ac5a12ca8",
        "pais": "vazio",
        "periodicidade": "recorrente",
        "private": False,
        "regiao": "internacional",
        "registro": "nao",
        "state": "active",
        "title": "List of Dirty, Naughty, Obscene, and Otherwise Bad Words",
        "type": "dataset",
        "url": "https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words",
        "versao": "",
        "version": None,
        "groups": [
            {
                "description": "",
                "display_name": "Cultura e Arte",
                "id": "d3d1edae-b979-49cf-9679-e94733fb2269",
                "image_display_url": "http://localhost:5000/uploads/group/2019-09-18-192314.327701821138883884682b08c5b.jpg",
                "name": "cultura-arte",
                "title": "Cultura e Arte",
            },
            {
                "description": "",
                "display_name": "Jornalismo e Comunicação",
                "id": "600a23dc-245f-4281-ac53-92a6e2a3edff",
                "image_display_url": "http://localhost:5000/uploads/group/2019-09-28-064636.490505journalism.png",
                "name": "comunicacao",
                "title": "Jornalismo e Comunicação",
            },
        ],
        "resources": [
            {
                "id": "2251834b-0359-49d1-b2e2-ce791d75bdd1",
                "name": "Baixar",
                "description": "",
                "url": "www.teste.com.br",
                "language": ["german", "bahasa", "urdu"],
                "has_api": "yes",
                "free": "no",
                "signup_needed": "yes",
                "availability": "online",
                "brazilian_ip": "no",
                "license_type": "MIT",
                "resource_type": "external_link",
            },
            {
                "id": "2251834b-0359-49d1-b2e2-ce791d75bdd1",
                "name": "Baixar",
                "description": "",
                "table_id": 10,
                "auxiliary_files_url": ["file_1", "file_2", "file_3"],
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
        ],
        "tags": [
            {
                "display_name": "lingua",
                "id": "456d0fe9-ba88-4552-8b89-799dbe6eaf94",
                "name": "lingua",
                "state": "active",
                "vocabulary_id": None,
            },
            {
                "display_name": "ofensa",
                "id": "d2093ee8-fafa-48ac-a6f5-df30bb66c24e",
                "name": "ofensa",
                "state": "active",
                "vocabulary_id": None,
            },
            {
                "display_name": "palavrao",
                "id": "8fca0e2b-2c87-4d36-9550-cfac84b621e1",
                "name": "palavrao",
                "state": "active",
                "vocabulary_id": None,
            },
        ],
        "relationships_as_subject": [],
        "relationships_as_object": [],
    }

    with raises(ValidationError) as e:
        BdmDataset.validate(master_dataset)

    import requests

    URL = "http://localhost:5000"
    ret = requests.get(
        URL
        + "/api/3/action/package_show?name_or_id=list-of-dirty-naughty-obscene-and-otherwise-bad-words"
    ).json()["result"]
    assert master_dataset == ret

def test_pydantic_validates_individual_items_in_a_list():
    from pydantic import BaseModel, ValidationError
    from typing import List, Optional, Literal, Union
    class Item(BaseModel):
        id: int

    class ManyItems(BaseModel):
        items: List[Item]
    try:
        ManyItems.validate({'items': [
                {'id': 12},
                {'id': '1edfgd2'},
                {'id': '154535345hfgdh345'},
        ]})
    except ValidationError as error:
        assert error.errors() == (
                [{'loc': ('items', 1, 'id'), 'msg': 'value is not a valid integer', 'type': 'type_error.integer'},
                {'loc': ('items', 2, 'id'), 'msg': 'value is not a valid integer', 'type': 'type_error.integer'}]
        )



if __name__ == "__main__":

    class A(BaseModel):
        __root__: AnyResource

    from jsonref import JsonRef, json

    print(
        json.dumps(JsonRef.replace_refs(LaiRequest.schema(), jsonschema=True), indent=2)
    )
