#!/bin/bash -ex

URL=$1

PACKAGE=$(python -c "import re; print(re.search(r'ckanext-(.*?).git', '$URL').group(1))")

git clone $URL

cd ckanext-$PACKAGE

ckan-pip install -e .

if [[ -f requirements.txt ]]; then
    ckan-pip install -r requirements.txt
fi

ckan-pip freeze | grep $PACKAGE # assert we are installed
