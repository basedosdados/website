from migration_functions import download_packages, migrate_nrows_field

LOCAL_CKAN_URL = "http://localhost:5000"
DEV_CKAN_URL = "https://staging.basedosdados.org"
PROD_CKAN_URL = "https://basedosdados.org"

local_packages = download_packages(LOCAL_CKAN_URL, "prod")
dev_packages = download_packages(DEV_CKAN_URL, "dev")
prod_packages = download_packages(PROD_CKAN_URL, "prod")

updated_packages = []

for package in local_packages[:10]:
    updated_package = migrate_nrows_field(package)
    updated_packages.append(updated_package)

