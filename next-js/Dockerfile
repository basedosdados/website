FROM node:alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock .
RUN yarn install

COPY . /app

RUN yarn build

CMD yarn start
EXPOSE 3000
