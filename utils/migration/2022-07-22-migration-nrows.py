from migration_functions import *

LOCAL_CKAN_URL = "http://localhost:5000"
DEV_CKAN_URL = "https://staging.basedosdados.org"
PROD_CKAN_URL = "https://basedosdados.org"

local_packages = download_packages(LOCAL_CKAN_URL, "prod")
# dev_packages = download_packages(DEV_CKAN_URL, "dev")
# prod_packages = download_packages(PROD_CKAN_URL, "prod")

class Migrator:
    def __init__(self, ckan_remote: RemoteCKAN, package_dict):
        self.ckan_remote = ckan_remote
        self.package_dict = package_dict

    def create(self):
        try:
            self.ckan_remote.action.package_create(**self.package_dict)
        except NotFound as e:
            print(e)

    def update(self):
        try:
            self.ckan_remote.action.package_update(**self.package_dict)
        except NotFound as e:
            print(e)

    def purge(self):
        try:
            self.ckan_remote.action.dataset_purge(id=self.package_dict["name"])
        except NotFound as e:
            print(e)

    def delete(self):
        try:
            self.ckan_remote.action.package_delete(id=self.package_dict["name"])
        except NotFound as e:
            print(e)

    def validate(self):
        try:
            self.ckan_remote.action.bd_dataset_validate(**self.package_dict)
        except NotFound as e:
            print(e)


