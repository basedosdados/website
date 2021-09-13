#!/bin/bash

# go to git root
cd "$(git rev-parse --show-toplevel)"

mkdir -p vendor/

cd vendor

# ckan is not installed using a simple pip install, we need to clone the git repo first
git clone https://github.com/ckan/ckan.git

cd ckan

git checkout ckan-2.9.3

# correct a bug in ckan
git diff 9abeaa1b7d2f6539ade946cc3f407878f49950eb^ 9abeaa1b7d2f6539ade946cc3f407878f49950eb | git apply

# using perl instead of sed -i as it is portable in Mac as well
# change markdown version because it is incompatible with python 3.9
perl -i -pe 's/markdown==2.6.7/markdown>=3.0/' requirements.txt

git add .
