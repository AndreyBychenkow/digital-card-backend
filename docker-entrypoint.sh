#!/bin/sh
# Brings the database up to date and then starts the API. Runs on every container start.
#   1. prisma migrate deploy applies migrations that are not applied yet.
#   2. The seed makes the card data match src/database/seed/profile.data.ts.
#   3. exec replaces this shell with the API process, so it receives SIGTERM directly.
set -eu

echo "[entrypoint] applying database migrations"
./node_modules/.bin/prisma migrate deploy

echo "[entrypoint] syncing card data"
node dist/database/seed/run-seed.js

echo "[entrypoint] starting: $*"
exec "$@"
