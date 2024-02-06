FROM node:20.11.0-alpine AS base

RUN apk add --no-cache libc6-compat
RUN apk update
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

RUN npm install -g turbo

COPY . .

RUN turbo prune --scope=web --docker

# First install the dependencies (as they change less often)
RUN pnpm install --frozen-lockfile

CMD pnpm dlx turbo run dev --filter=web