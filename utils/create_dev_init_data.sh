#!/bin/bash -ex
cd $(git rev-parse --show-toplevel)

docker-compose down -t0
docker-compose up -d db

FILE=$1
if [[ ! $FILE ]]; then
    echo Downloading dump from S3
    AWS_DEFAULT_REGION=us-east-2 AWS_PROFILE=basedosdados aws s3 cp s3://basedosdados/backup/postgres.dump /tmp/db-ckan.dump
    FILE=/tmp/db-ckan.dump
    function cleanup() { rm -f /tmp/db-ckan.dump; }
    trap cleanup EXIT
fi

DB="docker exec -i -e PGPASSWORD=ckan db"

$DB /wait-until-up localhost:5432
$DB bash -c 'dropdb -U ckan ckan --if-exists && createdb -U ckan ckan'
$DB pg_restore -U ckan -d ckan --format=custom --exit-on-error < $FILE

$DB psql -v ON_ERROR_STOP=1 -U ckan < ./utils/_clean_dump.sql

docker-compose run --rm -T ckan bash -xec '
    P="basedosdados"
    echo -e "$P\n$P\n" | ckan user setpass rdahis  # anonymize
'
docker-compose run --rm ckan bash -xc '
    ckan user remove dev
    ckan user add dev email=dev@dev.com password=12345678 fullname=DEV
    ckan sysadmin add dev
'

$DB pg_dump -U ckan --compress=9 --format=plain -d ckan --file=- > ./postgresql/dev_init_data.sql.gz

echo OK

echo 'Please test before commiting by running ` docker-compose down -vt0 && ./bootstrap.sh && ./test.sh `'
