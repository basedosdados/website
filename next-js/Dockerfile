# Install dependencies only when needed
FROM node:alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json .
RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000