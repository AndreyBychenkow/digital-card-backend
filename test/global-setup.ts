import { execSync } from 'node:child_process';

/**
 * Runs once before the e2e suite. The test database gets the same migrations
 * and seed that a fresh start applies, so the tests see the real card data.
 */
export default function setup(): void {
  execSync('npm run -s db:setup', { stdio: 'inherit' });
}
