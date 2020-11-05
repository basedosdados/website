#!/bin/bash
cd "$(git rev-parse --show-toplevel)" # go to git root

export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

if [[ ! -f configs/ckan.prod.ini ]]; then echo you need to have a configs/ckan.prod.ini; exit 1; fi;
if [[ ! -f .env.prod ]]; then echo you need to have a .env.prod; exit 1; fi;

set -ex

if [[ ! -d vendor/ckan/.git ]]; then
    mkdir -p vendor/
    ( cd vendor
      git clone https://github.com/ckan/ckan.git
      cd ckan
      git checkout ckan-2.9.0
      git diff 9abeaa1b7d2f6539ade946cc3f407878f49950eb^ 9abeaa1b7d2f6539ade946cc3f407878f49950eb | git apply
      git add .
    )
fi

docker-compose build --parallel
docker-compose up --scale ckan=0 -d

echo waiting for postgres to be ready ; docker exec db /wait-until-up

docker exec -i -e PGPASSWORD=ckan db bash -c 'dropdb -U ckan ckan --if-exists && createdb -U ckan ckan'
docker exec -i -e PGPASSWORD=ckan db psql -v ON_ERROR_STOP=1 --echo-errors --quiet -U ckan ckan < ./postgresql/dev_init_data.sql


if [[ ! -d assets/storage ]]; then
    if ! which git-lfs > /dev/null; then echo ERROR!!! PLEASE INSTALL git-lfs to retrieve assets; exit 1; fi
    git-lfs pull
    unzip assets.zip
    chmod -R 777 assets
fi


docker-compose run --rm --entrypoint='' ckan bash -c 'cd ckanext-basedosdados; pip install -e .' # to create the dev links in the volume
docker-compose up -d ckan

docker exec -it ckan ckan db upgrade

docker exec -it ckan ckan search-index rebuild
