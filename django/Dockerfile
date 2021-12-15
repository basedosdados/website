FROM python:3.8-slim-bullseye

ENV WORKSPACE=/usr/src/app
RUN mkdir -p $WORKSPACE
WORKDIR $WORKSPACE

COPY . $WORKSPACE

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt