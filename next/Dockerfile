# Install dependencies only when needed
FROM node:18.17.0-alpine  AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
    else echo "Lockfile not found." && exit 1; \
    fi

ARG URL_DOWNLOAD_CLOSED
ARG URL_DOWNLOAD_OPEN

# Rebuild the source code only when needed
FROM node:18.17.0-alpine AS builder

ARG NEXT_PUBLIC_DOMAIN
ARG NEXT_PUBLIC_SITE_NAME
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_KEY_STRIPE
ARG NEXT_PUBLIC_BASE_URL_FRONTEND
ARG URL_DOWNLOAD_CLOSED
ARG URL_DOWNLOAD_OPEN

ENV NEXT_PUBLIC_DOMAIN=$NEXT_PUBLIC_DOMAIN
ENV NEXT_PUBLIC_SITE_NAME=$NEXT_PUBLIC_SITE_NAME
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_KEY_STRIPE=$NEXT_PUBLIC_KEY_STRIPE
ENV NEXT_PUBLIC_BASE_URL_FRONTEND=$NEXT_PUBLIC_BASE_URL_FRONTEND

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM node:18.17.0-alpine AS runner
WORKDIR /app

ARG URL_DOWNLOAD_CLOSED
ARG URL_DOWNLOAD_OPEN

ENV NODE_ENV production
ENV NODE_OPTIONS '-r next-logger'
ENV URL_DOWNLOAD_CLOSED=$URL_DOWNLOAD_CLOSED
ENV URL_DOWNLOAD_OPEN=$URL_DOWNLOAD_OPEN
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["server.js"]
