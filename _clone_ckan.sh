#!/bin/bash
cd "$(git rev-parse --show-toplevel)" # go to git root

mkdir -p vendor/
cd vendor
git clone https://github.com/ckan/ckan.git  # Ckan is not installed using a simple pip install, we need to clone the git repo first
cd ckan
git checkout ckan-2.9.0
git diff 9abeaa1b7d2f6539ade946cc3f407878f49950eb^ 9abeaa1b7d2f6539ade946cc3f407878f49950eb | git apply # correct a bug in ckan
# Using perl instead of sed -i as it is portable in Mac as well
perl -i -pe 's/markdown==2.6.7/markdown>=3.0/' requirements.txt # Change markdown version because it is incompatible with python 3.9
git add .
