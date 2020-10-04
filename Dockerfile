# See CKAN docs on installation from Docker Compose on usage
FROM debian:stretch
MAINTAINER Open Knowledge

# Install required system packages
RUN apt-get -q -y update \
    && DEBIAN_FRONTEND=noninteractive apt-get -q -y upgrade \
    && apt-get -q -y install \
        python-dev \
        python-pip \
        python-virtualenv \
        python-wheel \
        python3-dev \
        python3-pip \
        python3-virtualenv \
        python3-wheel \
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
        wget \
    && apt-get -q clean \
    && rm -rf /var/lib/apt/lists/*

# Define environment variables
ENV CKAN_HOME /usr/lib/ckan
ENV CKAN_VENV $CKAN_HOME/venv
ENV CKAN_CONFIG /etc/ckan
ENV CKAN_STORAGE_PATH=/var/lib/ckan

# Build-time variables specified by docker-compose.yml / .env
ARG CKAN_SITE_URL

# Create ckan user
RUN useradd -r -u 900 -m -c "ckan account" -d $CKAN_HOME -s /bin/false ckan

# Setup virtual environment for CKAN
RUN mkdir -p $CKAN_VENV $CKAN_CONFIG $CKAN_STORAGE_PATH && \
    virtualenv $CKAN_VENV && \
    ln -s $CKAN_VENV/bin/pip /usr/local/bin/ckan-pip &&\
    ln -s $CKAN_VENV/bin/paster /usr/local/bin/ckan-paster &&\
    ln -s $CKAN_VENV/bin/ckan /usr/local/bin/ckan

# Setup CKAN
ADD vendor/ckan $CKAN_VENV/src/ckan/
RUN ckan-pip install -U pip && \
    ckan-pip install --upgrade --no-cache-dir -r $CKAN_VENV/src/ckan/requirement-setuptools.txt && \
    ckan-pip install --upgrade --no-cache-dir -r $CKAN_VENV/src/ckan/requirements-py2.txt && \
    ckan-pip install -e $CKAN_VENV/src/ckan/ && \
    ln -s $CKAN_VENV/src/ckan/ckan/config/who.ini $CKAN_CONFIG/who.ini && \
    cp -v $CKAN_VENV/src/ckan/contrib/docker/ckan-entrypoint.sh /ckan-entrypoint.sh && \
    chmod +x /ckan-entrypoint.sh && \
    chown -R ckan:ckan $CKAN_HOME $CKAN_VENV $CKAN_CONFIG $CKAN_STORAGE_PATH

ENTRYPOINT ["/ckan-entrypoint.sh"]

USER ckan
EXPOSE 5000

CMD ["ckan", "run", "--host", "0.0.0.0"]

###################
## OUR ADDITIONS ##
###################

ENV CKAN_INI=/app/configs/production.ini PYTHONDONTUSEBYTECODE=1 PIP_NO_PYTHON_VERSION_WARNING=1
RUN ckan-pip install ipdb # pra dev
USER root

# INSTALL EXTENSIONS

WORKDIR /app/extensions

COPY utils/install_extension /app/extensions/install_extension

RUN ./install_extension https://github.com/ckan/ckanext-pages.git
RUN ./install_extension https://github.com/ckan/ckanext-repo.git
RUN ./install_extension https://github.com/ckan/ckanext-scheming.git && ckan-pip install ckantoolkit ckanapi
RUN ./install_extension https://github.com/NaturalHistoryMuseum/ckanext-contact.git
RUN ./install_extension https://github.com/ckan/ckanext-googleanalytics.git
RUN ./install_extension https://github.com/stadt-karlsruhe/ckanext-discovery.git

RUN ckan-pip install python-Levenshtein unidecode nltk==3.4.5 ckanext-tagmanager # && $CKAN_VENV/bin/python -m nltk.downloader all
# RUN git clone https://github.com/cphsolutionslab/ckanext-customuserprivileges && cd ckanext-customuserprivileges && ckan-pip install -e .

COPY extensions/BD_dataset.json /app/extensions/ckanext-scheming/ckanext/scheming/BD_dataset.json

##### INSTALL Basedosdados Files

WORKDIR /app

# COPY configs
COPY ./utils/run ./vendor/ckan/ckan/config/who.ini /app/
COPY ./configs/ /app/configs/

# INSTALL OUR EXTENSION!

COPY ckanext-basedosdados /app/ckanext-basedosdados
RUN cd /app/ckanext-basedosdados && ckan-pip install -e .
RUN ckan-pip install flask_debugtoolbar
