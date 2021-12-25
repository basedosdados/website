FROM python:3.8-slim-bullseye

ENV WORKSPACE=/usr/src/app
RUN mkdir -p $WORKSPACE
WORKDIR $WORKSPACE

RUN apt update
RUN apt install -y libpq-dev gcc
RUN pip install --upgrade pip

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . $WORKSPACE
