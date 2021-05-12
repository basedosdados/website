#!/usr/bin/env python3
import os
import requests
from sys import exit

URL = os.environ.get('URL', "http://localhost:5000")

ret = requests.get(URL + '/api/3/action/package_show?name_or_id=br-sp-ssp-seguranca')
assert ret.status_code == 200, ret.json()
package = ret.json()['result']
print(package)

package['fred'] = 'fred'

ret = requests.post(URL + '/api/3/action/package_validate', json=package)
assert ret.status_code == 200, ret.json()

del package['name']
ret = requests.post(URL + '/api/3/action/package_validate', json=package)
assert ret.status_code == 409, ret.json()
assert ret.json()['error'] == {'name': ['Faltando valor'], '__type': 'Validation Error'}
