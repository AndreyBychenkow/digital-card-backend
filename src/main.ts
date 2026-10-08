import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // On SIGTERM (a redeploy in Docker or on Render) Nest runs onModuleDestroy,
  // so the database connections are closed instead of dropped.
  app.enableShutdownHooks();

  // The card is public and read-only, so any origin is allowed by default.
  // Set CORS_ORIGIN to a comma-separated list of origins to restrict access,
  // for example: CORS_ORIGIN=https://mysite.com,https://staging.mysite.com
  const corsOrigin = app.get(ConfigService).get<string>('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin ? corsOrigin.split(',').map((o) => o.trim()) : true,
    methods: ['GET', 'POST'],
  });

  const port = app.get(ConfigService).getOrThrow<number>('PORT');
  // 0.0.0.0 makes the server reachable from outside the container.
  await app.listen(port, '0.0.0.0');
  Logger.log(`GraphQL API is ready on port ${port}: http://localhost:${port}/graphql`, 'Bootstrap');
}

void bootstrap();
