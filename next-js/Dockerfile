# Install dependencies only when needed
FROM node:alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json .
RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]