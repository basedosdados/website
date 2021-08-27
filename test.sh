#!/bin/bash -ex

cd $(git rev-parse --show-toplevel)

trap 'catch $? $LINENO' ERR ; catch() { echo "Exit-code $1 occurred on line $2" ;}

if [[ ! $CKAN_API_KEY ]]; then source .ckan_dev_api_token; fi

URL=${URL:-"http://localhost:5000"}

if ! curl localhost:5000 --fail-early --silent > /dev/null ; then
    docker-compose up -d ckan
fi
utils/wait-for-200 -t 30 $URL

# Can't test dataset/new as it needs authentication.
# TODO: migrate this test in such a way we can test this

TEST_URLS='
    #
    dataset
    organization
    group
    about
    dataset/?download_type=BD+Mais
    dataset/?q=futebol
    dataset/br-geobr-mapas
    dataset/activity/br-geobr-mapas
    dataset/changes/aeb5306e-3a04-485d-9f74-bc1823412418
    dataset/br-geobr-mapas/resource/8a8b6cf2-ad8d-43f0-bb1f-278a28ee8abb
    dataset/br-geobr-mapas/resource/d7a86855-86fa-48eb-92ce-8a408ad4b4cf
'

for path in $TEST_URLS; do
    curl --silent --fail $URL/$path > /dev/null
done

pytest ./tests/test.py

docker-compose run --rm ckan pytest ./ckanext-basedosdados/ckanext/basedosdados/tests/ -vv

echo 'ALL OK :)'
