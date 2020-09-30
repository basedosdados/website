#!/bin/bash
cd "$(git rev-parse --show-toplevel)" # go to git root

set -ex

if [[ ! -d vendor/ckan/.git ]]; then
    mkdir -p vendor/
    ( cd vendor
      git clone --branch master --shallow-since=2020-09-01T00:00:00 https://github.com/ckan/ckan.git
      cd ckan
      git checkout e540797e89c7b49857cd2a1eecc9be5de6e909f8 # TODO: go to a tag instead
    )
fi

docker-compose build --parallel
docker-compose up --scale ckan=0 -d
while true; do
    { PGPASSWORD=ckan psql -h localhost -p 5432 -U ckan -d postgres -c 'select 1' > /dev/null 2>&1 && break
    } || { echo waiting for postgres to be ready ; sleep 1 ; }
done

docker cp ./postgres-prod-dump.custom db:/
# TODO: swap local for docker when postgres is in the same version as prod and backups
# docker exec -i -e PGPASSWORD=ckan db pg_restore -d postgres -v -h localhost -p 5432 -U ckan \
#        /postgres-prod-dump.custom --no-owner --exit-on-error
docker exec -i -e PGPASSWORD=ckan db dropdb -U ckan ckan_default --if-exists
docker exec -i -e PGPASSWORD=ckan db dropdb -U ckan ckan --if-exists
PGPASSWORD=ckan pg_restore -d postgres -v -h localhost -p 5432 -U ckan  --if-exists  --clean postgres-prod-dump.custom --create --no-owner --exit-on-error
docker exec -i -e PGPASSWORD=ckan db psql -U ckan -d postgres --command='ALTER DATABASE ckan_default RENAME TO ckan'

# docker run --rm -ti postgres:10 --entrypoint /bin/bash --network host -e PGPASSWORD=ckan pg_restore \
#    -d postgres -v -h lh -p 5432 -U ckan  --if-exists  --clean postgres-prod-dump.custom --create --no-owner --exit-on-error



if [[ ! -d assets/storage ]]; then
    if ! which git-lfs > /dev/null; then echo ERROR!!! PLEASE INSTALL git-lfs to retrieve assets; exit 1; fi
    git-lfs pull
    unzip assets.zip
    chmod -R 777 assets
fi

docker-compose up -d ckan

{
# TODO: discover why this isnt working on the first run
docker exec -it ckan usr/local/bin/ckan search-index rebuild ||
docker exec -it ckan usr/local/bin/ckan search-index rebuild
}

