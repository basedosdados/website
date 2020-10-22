#!/bin/bash -ex
cd $(git rev-parse --show-toplevel)

URL="http://localhost:5000"
docker-compose up -d ckan
utils/wait-for-200 -t 30 $URL

for path in dataset '#' organization group about 'dataset/?download_type=BD+Mais' 'dataset/?q=futebol'; do
    curl --silent --fail $URL/$path > /dev/null
done
