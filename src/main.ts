import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // On SIGTERM (a redeploy in Docker or on Render) Nest runs onModuleDestroy,
  // so the database connections are closed instead of dropped.
  app.enableShutdownHooks();
  // The card is public and read-only, so a browser on any origin may call the API.
  app.enableCors();

  const port = app.get(ConfigService).getOrThrow<number>('PORT');
  // 0.0.0.0 makes the server reachable from outside the container.
  await app.listen(port, '0.0.0.0');
  Logger.log(`GraphQL API is ready on port ${port}: http://localhost:${port}/graphql`, 'Bootstrap');
}

void bootstrap();
