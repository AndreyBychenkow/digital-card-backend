import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// DATABASE_URL is not required for `prisma generate`, so it is read without a hard check here.
// Commands that talk to the database (migrate, db seed) fail on their own if it is missing.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
