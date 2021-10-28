FROM node:16-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install

COPY . /app/

EXPOSE 3000
