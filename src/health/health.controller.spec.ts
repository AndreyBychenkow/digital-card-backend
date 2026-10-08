import { ServiceUnavailableException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { HealthController } from './health.controller.js';
import type { HealthService } from './health.service.js';

function controllerWithDatabase(up: boolean): HealthController {
  const health = { isDatabaseUp: () => Promise.resolve(up) } as unknown as HealthService;
  return new HealthController(health);
}

describe('HealthController', () => {
  it('answers ok while the database responds', async () => {
    await expect(controllerWithDatabase(true).check()).resolves.toEqual({
      status: 'ok',
      database: 'up',
    });
  });

  it('answers 503 when the database does not respond', async () => {
    await expect(controllerWithDatabase(false).check()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
