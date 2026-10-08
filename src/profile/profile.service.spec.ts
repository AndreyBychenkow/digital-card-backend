import { describe, expect, it } from 'vitest';
import type { ProfileRepository } from './profile.repository.js';
import { ProfileService } from './profile.service.js';

describe('ProfileService', () => {
  it('fails with an internal error when the seed has not created the profile', async () => {
    const repository = { findBySlug: () => Promise.resolve(null) } as unknown as ProfileRepository;

    await expect(new ProfileService(repository).getOwnerProfile()).rejects.toThrow(
      'is missing from the database',
    );
  });
});
