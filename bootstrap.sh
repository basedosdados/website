#!/bin/bash
cd "$(git rev-parse --show-toplevel)" # go to git root

set -e

if [[ ! -d vendor/ckan/.git ]]; then
    mkdir -p vendor/
    #git clone --depth=1 --branch ckan-2.9.0 https://github.com/ckan/ckan.git
    git clone --depth=1 --branch master https://github.com/ckan/ckan.git
    mv ckan vendor/
fi

docker-compose build --parallel
docker-compose up --scale ckan=0 -d

docker cp ./postgres-prod-dump.custom db:/
# TODO: swap local for docker when postgres is in the same version as prod and backups
PGPASSWORD=ckan pg_restore -d postgres -v -h localhost -p 5432 -U ckan  --if-exists  --clean postgres-prod-dump.custom --create --no-owner --exit-on-error
# docker run --rm -ti postgres:10 --entrypoint /bin/bash --network host -e PGPASSWORD=ckan pg_restore \
#    -d postgres -v -h lh -p 5432 -U ckan  --if-exists  --clean postgres-prod-dump.custom --create --no-owner --exit-on-error



# docker exec -i -e PGPASSWORD=ckan db dropdb -U ckan ckan_default --if-exists
# docker exec -i -e PGPASSWORD=ckan db pg_restore -d postgres -v -h localhost -p 5432 -U ckan \
#        /postgres-prod-dump.custom --no-owner --exit-on-error

if [[ ! -d assets/storage ]]; then
    if ! which git-lfs > /dev/null; then echo ERROR!!! PLEASE INSTALL git-lfs to retrieve assets; exit 1; fi
    git-lfs pull
    unzip assets.zip
fi

docker-compose up -d ckan
docker exec -it ckan /usr/local/bin/ckan search-index rebuild
