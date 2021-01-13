#!/bin/bash -ex
cd -P -- "$(dirname -- "$0")" # cd to this script's dir

# DB
docker-compose exec -T db pg_dump -U ckan --format=custom -d ckan --file=/tmp/postgres.dump
docker cp db:/tmp/postgres.dump /tmp/postgres.dump
aws s3 cp /tmp/postgres.dump s3://basedosdados/backup/postgres.dump --storage-class STANDARD_IA
echo backup ok

# Assets
rm -f /tmp/ckan_assets.zip
zip -q -r /tmp/ckan_assets.zip assets
cd /tmp
aws s3 cp /tmp/ckan_assets.zip s3://basedosdados/backup/ckan_assets.zip --storage-class STANDARD_IA

# Certificate
rm -f /tmp/letsencrypt.zip
zip -q -r /tmp/letsencrypt.zip /etc/letsencrypt/
aws s3 cp /tmp/letsencrypt.zip s3://basedosdados/backup/letsencrypt.zip --storage-class STANDARD_IA
