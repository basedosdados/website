#!/bin/bash

docker-compose stop ckan
docker-compose run --rm --service-ports ckan ckan run --host 0.0.0.0 --port 5000 --reloader true
