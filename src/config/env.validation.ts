export interface AppEnv {
  PORT: number;
  DATABASE_URL: string;
}

/**
 * Checks environment variables once at startup, so a missing or malformed
 * value fails fast with a readable message instead of a random runtime error.
 */
export function validateEnv(config: Record<string, unknown>): AppEnv {
  const databaseUrl = config.DATABASE_URL;
  if (typeof databaseUrl !== 'string' || !/^postgres(ql)?:\/\/.+/.test(databaseUrl)) {
    throw new Error(
      'DATABASE_URL is required and must be a PostgreSQL URL, ' +
        'for example postgresql://user:password@localhost:5432/digital_card',
    );
  }

  const port = Number(config.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PORT must be an integer from 1 to 65535, got "${String(config.PORT)}"`);
  }

  return { PORT: port, DATABASE_URL: databaseUrl };
}
