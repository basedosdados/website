#!/bin/bash -xe

# Run this script in prod to restore database from latest backup

# TODO: continue this script
# TODO: get docker ps id and run this inside
psql ckan ckan <<< 'select pg_terminate_backend(pid) from pg_stat_activity WHERE pid <> pg_backend_pid();'
dropdb -U ckan ckan --echo
createdb  --echo -U ckan ckan
pg_restore -U ckan -d ckan --exit-on-error --format=custom -v /tmp/postgres.dump
