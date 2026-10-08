import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// The e2e suite writes to its own database, so it never touches the dev data.
// Set in the config (not in test.env) because global setup runs before the workers.
process.env.DATABASE_URL =
  process.env.E2E_DATABASE_URL ??
  'postgresql://card:card@localhost:5432/digital_card_test?schema=public';

export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    globals: true,
    root: './',
    include: ['test/**/*.e2e-spec.ts'],
    globalSetup: ['test/global-setup.ts'],
    // e2e tests share one database, so they must not run in parallel.
    fileParallelism: false,
  },
});
