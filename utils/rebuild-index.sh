#!/bin/bash -ex
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

docker exec -it ckan ckan search-index rebuild --only-missing
docker exec -it ckan ckan search-index rebuild --verbose --force
docker exec -it ckan ckan search-index check
