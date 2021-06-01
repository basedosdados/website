#!/bin/bash -ex
cd $(git rev-parse --show-toplevel)

trap 'catch $? $LINENO' ERR ; catch() { echo "Exit-code $1 occurred on line $2" ;}

if [[ ! $CKAN_API_KEY ]]; then source .ckan_dev_api_token; fi

URL=${URL:-"http://localhost:5000"}

if ! curl localhost:5000 --fail-early --silent > /dev/null ; then
    docker-compose up -d ckan
fi
utils/wait-for-200 -t 30 $URL

# Cant test dataset/new as it needs authentication. TODO: migrate this test in such a way we can test this

TEST_URLS='
    #
    dataset
    organization
    group
    about
    dataset/?download_type=BD+Mais
    dataset/?q=futebol
    dataset/br-sp-gov-ssp
    dataset/activity/br-sp-gov-ssp
    dataset/changes/f0f49216-9eab-48a4-bd39-62b6b8fdc75d
    dataset/br-sp-gov-ssp/resource/bf77c64a-124d-4620-991e-456819d0c7a6
    dataset/br-sp-gov-ssp/resource/c9e2846a-c47a-49cf-bf3a-ab94969baa08
'

for path in $TEST_URLS; do
    curl --silent --fail $URL/$path > /dev/null
done

pytest ./tests/test.py

docker-compose run --rm ckan pytest ./ckanext-basedosdados/ckanext/basedosdados/tests/ -vv

echo 'ALL OK :)'

