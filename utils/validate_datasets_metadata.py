#!/usr/bin/env python3

from pprint import pprint
import sys
import os, json, re, requests
import ckanapi.errors
import pandas as pd
import random

from ckanapi import RemoteCKAN

if not os.environ.get('CKAN_API_KEY'):
    print("You need to export environment variable `CKAN_API_KEY`. PLease generate an api key from this page: http://localhost:5000/user/dev/api-tokens")
    exit(1)

user_agent = None
CKAN_API_KEY = os.environ['CKAN_API_KEY']
CKAN_URL = os.environ.get('CKAN_URL', 'http://localhost:5000')

basedosdados = RemoteCKAN(CKAN_URL, user_agent=user_agent, apikey=CKAN_API_KEY)

def check_package_by_name(package_name):
    package_dict = basedosdados.action.package_show(id=package_name)
    package_dict['extras'] = [kv for kv in package_dict['extras'] if 'key' in kv and 'value' in kv] # there is a strange bug splitting extra dicts into dicts missing value and key, so we simply remove these, we aren't validating extras anyway
    try:
        updated_resource = basedosdados.action.package_validate(**package_dict)
    except ckanapi.errors.ValidationError as e:
        e.package_dict = package_dict
        raise
    print(f'Package {package_name} succesfully validated!')

def check_all_packages(LIMIT=10):
    api_url = CKAN_URL + '/api/3/action/package_list'
    result = requests.get(api_url)
    assert result.status_code == 200

    package_list = json.loads(result.text)['result']
    package_list.sort(key=lambda _: random.random())
    errors = {}
    for package_name in package_list[:LIMIT]: # TODO: paralelizar isso
        try:
            check_package_by_name(package_name)
        except ckanapi.errors.ValidationError as e:
            errors[package_name] = e

    if errors:
        print('\n========== Errors found!!!! ===============')
        dataset, error = list(errors.items())[0]
        pprint(dataset); pprint(error.package_dict); print('--ERROR--'); pprint(error.error_dict)

        resources = []
        for dataset, error in errors.items():
            for r in error.error_dict.get('resources', []):
                resources.append(r)
        df = pd.DataFrame(resources)
        all_col_errors = []
        for c in df:
            col_errors = df[c].apply(str).value_counts().to_frame(name='count')
            col_errors['column'] = c
            all_col_errors.append(col_errors)
        if all_col_errors:
            all_col_errors = pd.concat(all_col_errors).set_index('column', append=True)
            all_col_errors.index.names = ['error_type', 'column']
            all_col_errors = all_col_errors.reset_index().query("error_type != 'nan'").set_index(['column', 'error_type'])
            all_col_errors.sort_values('count', ascending=False, inplace=True)

        print('\n ------ Summary of resource errors ------ ')
        print(all_col_errors)

        exit(1)


if __name__ == '__main__':
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    check_all_packages(limit)
