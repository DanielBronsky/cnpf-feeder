# syntax=docker/dockerfile:1

# Dockerfile
# Сборка и запуск Next.js приложения в production режиме (multi-stage: deps -> builder -> runner).

FROM node:22-alpine AS deps
WORKDIR /app

# Включаем yarn через corepack (идёт с Node 22)
RUN corepack enable && corepack prepare yarn@1.22.21 --activate

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time args (опционально для CI; при docker compose используют .env)
ARG NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
ARG AUTH_SECRET=build-placeholder
ENV NEXT_PUBLIC_GRAPHQL_URL=$NEXT_PUBLIC_GRAPHQL_URL
ENV AUTH_SECRET=$AUTH_SECRET
ENV NODE_ENV=production
RUN yarn build


FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000
CMD ["yarn", "start"]

