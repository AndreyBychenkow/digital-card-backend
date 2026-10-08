import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['test/**/*.e2e-spec.ts'],
    // e2e tests share one database, so they must not run in parallel.
    fileParallelism: false,
  },
});
