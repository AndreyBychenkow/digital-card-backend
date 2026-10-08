# syntax=docker/dockerfile:1

# Debian-based slim image: Prisma's CLI needs OpenSSL, which Alpine does not ship by default.
FROM node:24-slim AS base
RUN apt-get update \
 && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# 1. Build: install everything, generate the Prisma client and compile TypeScript.
FROM base AS build
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma7.config.ts ./
RUN npm ci
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
RUN npm run build

# 2. Production dependencies only. The postinstall step generates a client that is
#    not used at runtime; the one compiled into dist/ is.
FROM base AS prod-deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma7.config.ts ./
RUN npm ci --omit=dev

# 3. Runtime image.
FROM base AS runtime
ENV NODE_ENV=production \
    PORT=3000
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json prisma7.config.ts ./
COPY prisma ./prisma
COPY docker-entrypoint.sh ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/health').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"
# The entrypoint migrates and seeds the database, then runs CMD.
ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
