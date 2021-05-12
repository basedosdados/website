#!/usr/bin/env python3
import os
import requests
from sys import exit
import unittest.mock


CKAN_API_KEY = os.environ.get('CKAN_API_KEY')
CKAN_URL = os.environ.get('CKAN_URL', 'http://localhost:5000')
def get_client():
    from ckanapi import RemoteCKAN
    user_agent = None
    return RemoteCKAN(CKAN_URL, user_agent=user_agent, apikey=CKAN_API_KEY)

ckan = get_client()


def test():
    ret = requests.get(CKAN_URL + '/api/3/action/package_show?name_or_id=br-sp-ssp-seguranca')
    assert ret.status_code == 200, ret.json()
    package = ret.json()['result']

    ret = requests.post(CKAN_URL + '/api/3/action/package_validate', json=package)
    assert ret.status_code == 200, ret.json()
    assert ckan.action.package_validate(**package)

    if CKAN_API_KEY: # TODO: create an API KEY on db
        ret = ckan.action.package_update(**package)
        ret['metadata_modified'] = unittest.mock.ANY
        assert package == ret

    del package['name']
    ret = requests.post(CKAN_URL + '/api/3/action/package_validate', json=package)
    assert ret.status_code == 409, ret.json()
    assert ret.json()['error'] == {'message': [{'loc': ['name'], 'msg': 'field required', 'type': 'value_error.missing'}], '__type': 'Validation Error'}

if __name__ == '__main__': test()
