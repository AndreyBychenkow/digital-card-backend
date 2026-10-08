import { describe, expect, it } from 'vitest';
import { validateEnv } from './env.validation.js';

describe('validateEnv', () => {
  it('accepts a PostgreSQL URL and defaults the port to 3000', () => {
    expect(validateEnv({ DATABASE_URL: 'postgresql://user:pass@localhost:5432/db' })).toEqual({
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      PORT: 3000,
    });
  });

  it('rejects a missing URL or a URL for another database', () => {
    expect(() => validateEnv({})).toThrow('DATABASE_URL is required');
    expect(() => validateEnv({ DATABASE_URL: 'mysql://user:pass@localhost/db' })).toThrow(
      'DATABASE_URL is required',
    );
  });

  it('rejects a port outside the range 1–65535', () => {
    const DATABASE_URL = 'postgresql://user:pass@localhost/db';
    expect(() => validateEnv({ DATABASE_URL, PORT: 'abc' })).toThrow('PORT must be an integer');
    expect(() => validateEnv({ DATABASE_URL, PORT: '70000' })).toThrow('PORT must be an integer');
  });
});
