#!/bin/bash
cd "$(git rev-parse --show-toplevel)" # go to git root

export DOCKER_BUILDKIT=1  # We use some advanced docker features when building so we need to turn this on
export COMPOSE_DOCKER_CLI_BUILD=1
source .ckan_dev_api_token # export CKAN_API_KEY

not_installed() { ! command -v $1 > /dev/null; return $?; }

if not_installed git-lfs; then        echo please install git-lfs: https://git-lfs.github.com/ ; exit 1; fi;
if not_installed docker; then         echo you need to have docker installed; exit 1; fi;
if not_installed docker-compose; then echo you need to have a docker-compose installed; exit 1; fi
if [[ ! -f configs/ckan.override.prod.ini ]]; then echo you need to have a configs/ckan.override.prod.ini; exit 1; fi;
if [[ ! -f .env.prod ]]; then echo you need to have a .env.prod; exit 1; fi;

set -ex

if [[ $1 == full ]]; then
    rm -fr vendor/ckan stack/ckan/assets
fi

if [[ ! -d vendor/ckan/.git ]]; then
    mkdir -p vendor/
    ( cd vendor
      git clone https://github.com/ckan/ckan.git  # Ckan is not installed using a simple pip install, we need to clone the git repo first
      cd ckan
      git checkout ckan-2.9.0
      git diff 9abeaa1b7d2f6539ade946cc3f407878f49950eb^ 9abeaa1b7d2f6539ade946cc3f407878f49950eb | git apply # correct a bug in ckan
      sed -i 's/markdown==2.6.7/markdown>=3.0/' requirements.txt # Change markdown version because it is incompatible with python 3.9
      git add .
    )
fi

docker-compose build --parallel
docker-compose up --scale ckan=0 -d

echo waiting for postgres to be ready ; docker exec db /wait-until-up

docker exec -i -e PGPASSWORD=ckan db bash -c 'dropdb -U ckan ckan --if-exists && createdb -U ckan ckan'
(
    gzip -d -c ./stack/postgresql/dev_init_data.sql.gz
    cat ./stack/postgresql/insert_api_token.sql
) | \
        docker exec -i -e PGPASSWORD=ckan db \
        psql -v ON_ERROR_STOP=1 --echo-errors --quiet -U ckan ckan


if [[ ! -d ./stack/ckan/assets/storage ]]; then
    if ! which git-lfs > /dev/null; then echo ERROR!!! PLEASE INSTALL git-lfs to retrieve assets; exit 1; fi
    (
        cd stack/ckan
        git-lfs pull
        unzip assets.zip
        chmod -R 777 assets
    )
    # to update assets please fill folder with new assets and run `zip -r assets.zip assets` and commit zip to git as usual. Zip file will be sent to lfs.
fi


docker-compose run --rm --entrypoint='' ckan bash -c 'cd ckanext-basedosdados; pip install -e .' # to create the dev links in the volume
docker-compose up -d ckan

docker exec -it ckan ckan db upgrade

docker exec -it ckan ckan search-index rebuild
