#!/usr/bin/env python3
import os
import requests
from sys import exit
import unittest.mock
from copy import deepcopy
import random
from pprint import pprint


CKAN_API_KEY = os.environ.get('CKAN_API_KEY') or open('.ckan_dev_api_token').read().split('=')[-1].strip()
CKAN_URL = os.environ.get('CKAN_URL', 'http://localhost:5000')
def get_client():
    from ckanapi import RemoteCKAN
    user_agent = None
    return RemoteCKAN(CKAN_URL, user_agent=user_agent, apikey=CKAN_API_KEY)

ckan = get_client()


def test():
    ret = requests.get(CKAN_URL + '/api/3/action/package_show?name_or_id=br-sp-gov-ssp')
    assert ret.status_code == 200, ret.json()
    package = ret.json()['result']

    ret = requests.post(CKAN_URL + '/api/3/action/package_validate', json=package)
    assert ret.status_code == 200, ret.json()
    assert ckan.action.package_validate(**package)

    if CKAN_API_KEY:
        ret = ckan.action.package_update(**package)
        ret['metadata_modified'] = unittest.mock.ANY
        assert package == ret, (package, ret)

        new_package = deepcopy(package)
        del new_package['id']
        for r in new_package['resources']: del r['id']
        new_package['name'] = f'test-{random.randint(0, 1e6)}'
        ret = ckan.action.package_create(**new_package)
        ret['metadata_created'] = unittest.mock.ANY
        ret['metadata_modified'] = unittest.mock.ANY
        ret['creator_user_id'] = unittest.mock.ANY
        for r in ret['resources']:
            r['package_id'] = unittest.mock.ANY
            r['metadata_modified'] = unittest.mock.ANY
        for r in new_package['resources']:
            r['id'] = unittest.mock.ANY
        # for e in new_package['extras']:
        #     e['package_id'] = unittest.mock.ANY
        new_package['id'] = unittest.mock.ANY
        assert new_package == ret

        ret = ckan.action.package_delete(id=ret['id'])

    del package['name']
    ret = requests.post(CKAN_URL + '/api/3/action/package_validate', json=package)
    assert ret.status_code == 409, ret.json()
    assert ret.json()['error'] == {'message': [{'loc': ['name'], 'msg': 'field required', 'type': 'value_error.missing'}], '__type': 'Validation Error'}

if __name__ == '__main__': test()
