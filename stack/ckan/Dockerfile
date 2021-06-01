# syntax=docker/dockerfile:1.1.7-experimental
# This dockerfile uses an extended syntax, search google for more information on `syntax=docker/dockerfile:1.1.7-experimental`

############## EXTENSIONS ###############
FROM alpine as extensions
WORKDIR /extensions
RUN apk add git
# RUN git clone https://github.com/ckan/ckanext-pages.git
# RUN git clone https://github.com/ckan/ckanext-repo.git
# RUN git clone https://github.com/ckan/ckanext-scheming.git
# RUN git clone https://github.com/NaturalHistoryMuseum/ckanext-contact.git
RUN git clone https://github.com/ckan/ckanext-googleanalytics.git
RUN git clone https://github.com/stadt-karlsruhe/ckanext-discovery.git

################ BUILDER #################
FROM python:3.9 as builder
LABEL maintainer="Base dos Dados"
ENV PYTHONDONTWRITEBYTECODE=1 PIP_NO_PYTHON_VERSION_WARNING=1

RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/lib/apt,id=apt_list \
    --mount=type=cache,target=/var/cache/apt,id=apt_arch \
    apt-get -q -y update \
    && apt-get -y install \
        libpq-dev libxml2-dev libxslt-dev libgeos-dev libssl-dev  \
        libffi-dev postgresql-client build-essential git-core vim wget crudini

RUN python3 -m venv /venv
ENV PYTHONDONTWRITEBYTECODE=1 VIRTUAL_ENV=/venv PATH=/venv/bin:$PATH

# Setup CKAN
COPY vendor/ckan/ /ckan/
RUN --mount=type=cache,target=/root/.cache/pip/,id=pip \
    pip install -U pip setuptools==45 && \
    pip install /ckan/[requirements] && \
    pip install sqlalchemy==1.3.19 tzlocal==2.1 # Upgrade some CKAN dependencies that are emmiting warnings for py3.8

# No need for that crap!  RUN cp -v /ckan/contrib/docker/ckan-entrypoint.sh /ckan-entrypoint.sh && chmod +x /ckan-entrypoint.sh

###################
## OUR ADDITIONS ##
###################

RUN --mount=type=cache,target=/root/.cache/pip/,id=pip \
    pip install ipdb flask_debugtoolbar gunicorn

# INSTALL EXTENSIONS

# COPY utils/install_extension /app/extensions/install_extension
COPY --from=extensions /extensions /app/extensions
COPY ckanext-basedosdados/requirements.txt /app/extensions/ckanext-basedosdados/requirements.txt
RUN --mount=type=cache,target=/root/.cache/pip/,id=pip \
    cat /app/extensions/*/requirements.txt | egrep -v '^ *[.#]( |$)' | tee /tmp/reqs \
    && pip install -r /tmp/reqs \
    && pip install ckantoolkit ckanapi \
        python-Levenshtein unidecode nltk==3.4.5 ckanext-tagmanager # && /venv/bin/python -m nltk.downloader all
# RUN git clone https://github.com/cphsolutionslab/ckanext-customuserprivileges && cd ckanext-customuserprivileges && pip install -e .

# COPY configs
COPY ./configs/ /app/configs/
RUN crudini --merge --inplace /app/configs/ckan.ini < /app/configs/ckan.override.prod.ini && \
    crudini --set --inplace /app/configs/ckan.ini app:main ckan.plugins "$(crudini --get /app/configs/ckan.ini app:main ckan.plugins) $(crudini --get /app/configs/ckan.ini app:main ckan.plugins_prod)"
COPY ./stack/ckan/wsgi.py /app/wsgi.py

#################################
######### FINAL IMAGE ###########
#################################

FROM python:3.9-slim as final
WORKDIR /app
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
        CMD curl -f http://localhost:5000 || exit 1

ENV CKAN_STORAGE_PATH=/app/uploads CKAN_INI=/app/configs/ckan.ini
ENV PIP_NO_PYTHON_VERSION_WARNING=1 PYTHONDONTWRITEBYTECODE=1 PYTHONBREAKPOINT="ipdb.set_trace"
ENV VIRTUAL_ENV=/venv PATH=/venv/bin:$PATH

# System dependencies
RUN --mount=type=cache,target=/var/lib/apt,id=apt_list2 --mount=type=cache,target=/var/cache/apt,id=apt_arch2\
        apt-get update && apt-get install -y libmagic1 libpq-dev libxslt-dev \
                curl htop vim   # plus some goodies

# Get files

COPY --from=extensions /extensions /app/extensions
COPY --from=builder /venv /venv

# Install extensions
RUN --mount=type=cache,target=/root/.cache/pip/,id=pip \
    pip install `for i in /app/extensions/*; do echo -e $i; done`
#
# Install debug/dev goodies
# For %debug% jinja directive | for bug fix in werkzeug debug scope | for better stack traces
RUN --mount=type=cache,target=/root/.cache/pip/,id=pip \
    pip install jinja2==2.11.2 Werkzeug==1.0.1 better_exceptions

COPY ckanext-basedosdados /app/ckanext-basedosdados
RUN --mount=type=cache,target=/root/.cache/pip/,id=pip \
    pip install -e /app/ckanext-basedosdados
COPY --from=builder /app/wsgi.py /app/
COPY --from=builder /app/configs/who.ini /app/configs/ckan.ini /app/configs/
