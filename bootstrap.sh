#!/bin/bash

# go to git root
cd "$(git rev-parse --show-toplevel)"

# we use some advanced docker features
# when building so we need to turn this on
export DOCKER_BUILDKIT=1  
export COMPOSE_DOCKER_CLI_BUILD=1

# export CKAN_API_KEY
source configs/ckan-dev-api-token.sh

# test if git-lfs, docker and docker-compose are installed
not_installed() { ! command -v $1 > /dev/null; return $?; }
if not_installed git-lfs; then echo please install git-lfs; exit 1; fi;
if not_installed docker; then echo please install docker; exit 1; fi;
if not_installed docker-compose; then echo please install docker-compose; exit 1; fi;

# create empty .env.prod and empty configs/ckan.override.prod.in
if [ ! -f .env.prod ]; then echo > .env.prod; fi;
if [ ! -f configs/ckan.override.prod.ini ]; then echo > configs/ckan.override.prod.ini; fi;

set -ex

# if option full is enabled, do a hard reset
if [[ $1 == full ]]; then
    rm -fr vendor/ckan stack/ckan/assets
    docker-compose down -vt0
    docker builder prune --all --force
    DOCKER_BUILD_EXTRA_ARGS='--no-cache --pull'
fi

# clone ckan assets
if [[ ! -d vendor/ckan/.git ]]; then
    ./utils/clone-ckan.sh
fi

# build and instantiate images, except by ckan
# add the flag--parallel for speed
docker-compose build --parallel $DOCKER_BUILD_EXTRA_ARGS
docker-compose up --scale ckan=0 -d

# waiting for postgres to be ready
echo waiting for postgres to be ready
docker exec db /wait-until-up

# create and populate ckan db
docker exec -i -e PGPASSWORD=ckan db bash -c 'dropdb -U ckan ckan --if-exists && createdb -U ckan ckan'
(
    gzip -d -c ./stack/postgresql/dev_init_data.sql.gz
    cat ./stack/postgresql/insert_api_token.sql
) | docker exec -i -e PGPASSWORD=ckan db psql -v ON_ERROR_STOP=1 --echo-errors --quiet -U ckan ckan


# unzip website assets
if [[ ! -d ./stack/ckan/assets/assets ]]; then
    if ! which git-lfs > /dev/null; then
        echo ERROR!!! PLEASE INSTALL git-lfs to retrieve assets
        exit 1
    fi
    (
        cd stack/ckan
        git-lfs pull
        unzip assets.zip
        chmod -R 777 assets
    )
    # to update assets please fill folder with new assets and run `zip -r assets.zip assets`
    # and commit zip to git as usual. Zip file will be sent to lfs.
fi

# to create the dev links in the volume
docker-compose run --rm --entrypoint='' ckan bash -c 'cd ckanext-basedosdados; pip install -e .'

# start ckan container
docker-compose up -d ckan

# upgrade ckan database
docker exec -it ckan ckan db upgrade

# rebuild ckan index
docker exec -it ckan ckan search-index rebuild --verbose

# start nginx container
docker-compose up -d nginx
