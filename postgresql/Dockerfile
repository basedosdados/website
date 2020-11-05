FROM mdillon/postgis:11
MAINTAINER Open Knowledge
USER root

# Allow connections; we don't map out any ports so only linked docker containers can connect
RUN echo "host all  all    0.0.0.0/0  md5" >> /var/lib/postgresql/data/pg_hba.conf

# Customize default user/pass/db
ENV POSTGRES_DB ckan
ENV POSTGRES_USER ckan
ARG POSTGRES_PASSWORD
ARG DS_RO_PASS
ENV DS_RO_PASS=$DS_RO_PASS

# Include datastore setup scripts
ADD ./postgresql/docker-entrypoint-initdb.d /docker-entrypoint-initdb.d

FROM postgres:11

ENV POSTGRES_USER ckan
ARG POSTGRES_PASSWORD
ADD ./postgresql/docker-entrypoint-initdb.d/00_create_datastore.sh /docker-entrypoint-initdb.d/00_create_datastore.sh
COPY ./postgresql/wait-until-up /wait-until-up
