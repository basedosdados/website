#!/bin/bash -ex
cd $(git rev-parse --show-toplevel)

trap 'catch $? $LINENO' ERR ; catch() { echo "Exit-code $1 occurred on line $2" ;}

URL=${URL:-"http://localhost:5000"}
docker-compose up -d ckan
utils/wait-for-200 -t 30 $URL

TEST_URLS='
    #
    dataset
    organization
    group
    about
    dataset/?download_type=BD+Mais
    dataset/?q=futebol
    dataset/br-sp-ssp-seguranca
    dataset/activity/br-sp-ssp-seguranca
    dataset/changes/f0f49216-9eab-48a4-bd39-62b6b8fdc75d
    dataset/br-sp-ssp-seguranca/resource/bf77c64a-124d-4620-991e-456819d0c7a6
    dataset/br-sp-ssp-seguranca/resource/c9e2846a-c47a-49cf-bf3a-ab94969baa08
'

for path in $TEST_URLS; do
    curl --silent --fail $URL/$path > /dev/null
done

URL="$URL" python ./test.py

echo 'ALL OK :)'
