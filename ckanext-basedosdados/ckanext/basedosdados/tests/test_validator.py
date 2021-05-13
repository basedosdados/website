from ckanext.basedosdados.validator.package import Package, ValidationError
import jsonschema

import pytest
from pytest import raises

@pytest.fixture()
def data():
    DATE = '1990-01-01T00:00:00'
    return {
        'id': '123'
        ,'name': '123'
        ,'title': '123'
        ,'type': 'dataset'
        ,'state': 'active'
        ,'metadata_created': DATE
        ,'metadata_modified': DATE
        ,'num_resources': 1
        ,'num_tags': 1
        ,'resources': [{}]
        ,'temporal_coverage': [2020]
        ,'creator_user_id': '123e4567-e89b-12d3-a456-426614174000'
        , 'owner_org': '123e4567-e89b-12d3-a456-426614174000'
    }

def jsonify(data):
    from pydantic.json import pydantic_encoder
    import json
    return json.loads(json.dumps(data, default=pydantic_encoder))

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
    out = out.dict(exclude={'action__'})
    out = jsonify(out)
    jsonschema.validate(jsonify(data), Package.schema())
    for k, v in data.items(): # assert data is a subsed of out.dict()
        assert out[k] == v


@pytest.mark.skip
def test_ckanize():
    master_dataset = {
            'ano': ['atual'],
            'api': 'nao',
            'author': None,
            'author_email': None,
            'autor': '',
            'autor_email': '',
            'coleta': 'projeto',
            'creator_user_id': '27eaffe3-f79b-469f-8f02-4716146bdfcc',
            'disponibilidade': 'online',
            'download_type': 'Link Externo',
            'estado': 'vazio',
            'gratis': 'sim',
            'id': 'fb7af1b7-8169-46d3-93ae-a4e2ac2a46fa',
            'idioma': ['ingles'],
            'ip_brasileiro': 'nao',
            'isopen': False,
            'license_id': None,
            'license_title': None,
            'maintainer': None,
            'maintainer_email': None,
            'mantenedor': '',
            'mantenedor_email': '',
            'metadata_created': '2020-08-26T17:02:38.517037',
            'metadata_modified': '2020-08-26T17:03:31.181690',
            'microdados': 'sim',
            'name': 'list-of-dirty-naughty-obscene-and-otherwise-bad-words',
            'nivel_observacao': ['outro'],
            'notes': 'Com milhões de imagens em nossa biblioteca e bilhões de palavras-chave enviadas por usuários, trabalhamos duro na Shutterstock para garantir que palavrões não apareçam em lugares que não deveriam. Este repo contém uma lista de palavras que usamos para filtrar resultados de nosso servidor de preenchimento automático e mecanismo de recomendação.\r\n\r\nAviso óbvio: essas listas contêm material que muitos considerarão ofensivo. (Mas esse é o ponto!)',
            'num_resources': 1,
            'num_tags': 3,
            'organization': {'id': 'f9157f9b-1797-4bdb-a390-758ac5a12ca8',
             'name': 'shutterstock',
             'title': 'Shutterstock',
             'type': 'organization',
             'description': 'www.shutterstock.com',
             'image_url': '2020-08-26-165941.867765246x0w.png',
             'created': '2020-08-26T16:59:42.740591',
             'is_organization': True,
             'approval_status': 'approved',
             'state': 'active'},
            'owner_org': 'f9157f9b-1797-4bdb-a390-758ac5a12ca8',
            'pais': 'vazio',
            'periodicidade': 'recorrente',
            'private': False,
            'regiao': 'internacional',
            'registro': 'nao',
            'state': 'active',
            'title': 'List of Dirty, Naughty, Obscene, and Otherwise Bad Words',
            'type': 'dataset',
            'url': 'https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words',
            'versao': '',
            'version': None,
            'groups': [{'description': '',
              'display_name': 'Cultura e Arte',
              'id': 'd3d1edae-b979-49cf-9679-e94733fb2269',
              'image_display_url': 'http://localhost:5000/uploads/group/2019-09-18-192314.327701821138883884682b08c5b.jpg',
              'name': 'cultura-arte',
              'title': 'Cultura e Arte'},
             {'description': '',
              'display_name': 'Jornalismo e Comunicação',
              'id': '600a23dc-245f-4281-ac53-92a6e2a3edff',
              'image_display_url': 'http://localhost:5000/uploads/group/2019-09-28-064636.490505journalism.png',
              'name': 'comunicacao',
              'title': 'Jornalismo e Comunicação'}],
            'resources': [{'cache_last_updated': None,
              'cache_url': None,
              'created': '2020-08-26T17:03:18.892877',
              'datastore_active': False,
              'descricao': '',
              'description': '',
              'format': '',
              'formato': '',
              'hash': '',
              'id': '0d50b294-cbcd-40b8-9f2a-4d7459c70459',
              'last_modified': None,
              'metadata_modified': '2020-08-26T17:03:18.892877',
              'mimetype': None,
              'mimetype_inner': None,
              'name': 'Baixar (Projeto Github)',
              'package_id': 'fb7af1b7-8169-46d3-93ae-a4e2ac2a46fa',
              'position': 0,
              'resource_type': None,
              'size': None,
              'state': 'active',
              'url': 'https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words',
              'url_type': None}],
            'tags': [{'display_name': 'lingua',
              'id': '456d0fe9-ba88-4552-8b89-799dbe6eaf94',
              'name': 'lingua',
              'state': 'active',
              'vocabulary_id': None},
             {'display_name': 'ofensa',
              'id': 'd2093ee8-fafa-48ac-a6f5-df30bb66c24e',
              'name': 'ofensa',
              'state': 'active',
              'vocabulary_id': None},
             {'display_name': 'palavrao',
              'id': '8fca0e2b-2c87-4d36-9550-cfac84b621e1',
              'name': 'palavrao',
              'state': 'active',
              'vocabulary_id': None}],
            'relationships_as_subject': [],
            'relationships_as_object': []}

    import requests
    URL = 'http://localhost:5000'
    ret = requests.get(URL + '/api/3/action/package_show?name_or_id=list-of-dirty-naughty-obscene-and-otherwise-bad-words').json()['result']
    assert master_dataset == ret




if __name__ == '__main__':
    class A(BaseModel):
        __root__ : AnyResource

    from jsonref import JsonRef, json
    print(json.dumps(
        JsonRef.replace_refs(LaiRequest.schema(), jsonschema=True)
    ,indent=2))
