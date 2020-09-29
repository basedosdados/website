
set -e
docker-compose build --parallel
docker-compose up --scale ckan=0 -d

docker copy ./postgres-prod-dump.custom db:/
# TODO: swap local for docker when postgres is in the same version as prod and backups
PGPASSWORD=ckan pg_restore -d postgres -v -h lh -p 5432 -U ckan  --if-exists  --clean postgres-prod-dump.custom --create --no-owner --exit-on-error
# docker run --rm -ti postgres:10 --entrypoint /bin/bash --network host -e PGPASSWORD=ckan pg_restore \
#    -d postgres -v -h lh -p 5432 -U ckan  --if-exists  --clean postgres-prod-dump.custom --create --no-owner --exit-on-error



# docker exec -i -e PGPASSWORD=ckan db dropdb -U ckan ckan_default --if-exists
# docker exec -i -e PGPASSWORD=ckan db pg_restore -d postgres -v -h localhost -p 5432 -U ckan \
#        /postgres-prod-dump.custom --no-owner --exit-on-error


docker-compose up ckan -d
docker exec -it ckan /usr/local/bin/ckan search-index rebuild
