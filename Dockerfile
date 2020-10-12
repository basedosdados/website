# syntax=docker/dockerfile:1.1.7-experimental

FROM alpine as extensions
WORKDIR /extensions
RUN apk add git
RUN git clone https://github.com/ckan/ckanext-pages.git
RUN git clone https://github.com/ckan/ckanext-repo.git
RUN git clone https://github.com/ckan/ckanext-scheming.git
RUN git clone https://github.com/NaturalHistoryMuseum/ckanext-contact.git
RUN git clone https://github.com/ckan/ckanext-googleanalytics.git
RUN git clone https://github.com/stadt-karlsruhe/ckanext-discovery.git

# See CKAN docs on installation from Docker Compose on usage
FROM python:3.8
MAINTAINER Open Knowledge

# Install required system packages
RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/lib/apt,id=apt_list \
    --mount=type=cache,target=/var/cache/apt,id=apt_arch \
    apt-get -q -y update \
    && DEBIAN_FRONTEND=noninteractive apt-get -q -y upgrade \
    && apt-get -y install \
        libpq-dev \
        libxml2-dev \
        libxslt-dev \
        libgeos-dev \
        libssl-dev \
        libffi-dev \
        postgresql-client \
        build-essential \
        git-core \
        vim \
        wget

# Define environment variables
ENV CKAN_VENV /venv
ENV CKAN_CONFIG /ckan-config
ENV CKAN_STORAGE_PATH=/var/lib/ckan

# Create ckan user
# RUN useradd -r -u 900 -m -c "ckan account" -d $CKAN_HOME -s /bin/false ckan

# Setup virtual environment for CKAN
RUN mkdir -p $CKAN_VENV $CKAN_CONFIG $CKAN_STORAGE_PATH && \
    python3 -m venv $CKAN_VENV && \
    true
    #ln -s $CKAN_VENV/bin/pip /usr/local/bin/ckan-pip && \
    #ln -s $CKAN_VENV/bin/paster /usr/local/bin/ckan-paster && \
    #ln -s $CKAN_VENV/bin/ckan /usr/local/bin/ckan

# Setup CKAN
COPY vendor/ckan/ /ckan/
ENV PYTHONDONTWRITEBYTECODE=1 VIRTUAL_ENV=/venv PATH=/venv/bin:$PATH
RUN --mount=type=cache,target=/root/.cache/pip/,id=pip \
    pip install -U pip setuptools==45 && \
    pip install /ckan/[requirements]
    #pip install --upgrade -r /ckan/requirement-setuptools.txt && \
    #pip install --upgrade -r /ckan/requirements-py2.txt && \

RUN cp /ckan/ckan/config/who.ini $CKAN_CONFIG/who.ini && \
    cp -v /ckan/contrib/docker/ckan-entrypoint.sh /ckan-entrypoint.sh && \
    chmod +x /ckan-entrypoint.sh

ENTRYPOINT ["/ckan-entrypoint.sh"]

EXPOSE 5000

CMD ["ckan", "run", "--host", "0.0.0.0"]

# Upgrade some CKAN dependencies that are emmiting warnings for py3.8
RUN --mount=type=cache,target=/root/.cache/pip/,id=pip pip install \
    sqlalchemy==1.3.19 tzlocal==2.1
###################
## OUR ADDITIONS ##
###################

USER root

RUN echo 'exec pip "$@"' > /bin/ckan-pip && chmod +x /bin/ckan-pip
ENV CKAN_INI=/app/configs/production.ini PYTHONDONTUSEBYTECODE=1 PIP_NO_PYTHON_VERSION_WARNING=1
RUN --mount=type=cache,target=/root/.cache/pip/,id=pip \
    ckan-pip install ipdb flask_debugtoolbar gunicorn
RUN --mount=type=cache,target=/var/lib/apt,id=apt_list --mount=type=cache,target=/var/cache/apt,id=apt_arch \
        apt-get update && apt-get install -y curl htop


# INSTALL EXTENSIONS

WORKDIR /app/extensions

# COPY utils/install_extension /app/extensions/install_extension
COPY --from=extensions /extensions /app/extensions
RUN --mount=type=cache,target=/root/.cache/pip/,id=pip \
    pip install `for i in /app/extensions/*; do echo -e $i; done`
RUN --mount=type=cache,target=/root/.cache/pip/,id=pip \
    cat /app/extensions/*/requirements.txt | egrep -v '^ *[.#]( |$)' | tee /tmp/reqs \
    && pip install -r /tmp/reqs \
    && pip install ckantoolkit ckanapi \
        python-Levenshtein unidecode nltk==3.4.5 ckanext-tagmanager # && $CKAN_VENV/bin/python -m nltk.downloader all
# RUN git clone https://github.com/cphsolutionslab/ckanext-customuserprivileges && cd ckanext-customuserprivileges && ckan-pip install -e .

COPY extensions/BD_dataset.yaml /app/extensions/ckanext-scheming/ckanext/scheming/BD_dataset.yaml

##### INSTALL Basedosdados Files

WORKDIR /app

# COPY configs
COPY ./utils/run ./vendor/ckan/ckan/config/who.ini /app/
COPY ./configs/ /app/configs/
RUN cat ./configs/production.*ini > /tmp/a && mv /tmp/a ./configs/production.ini
COPY ./wsgi.py /app/wsgi.py

# INSTALL OUR EXTENSION!


COPY ckanext-basedosdados /app/ckanext-basedosdados
RUN cd /app/ckanext-basedosdados && ckan-pip install -e .

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
        CMD curl -f http://localhost:5000 || exit 1
#### END ####
