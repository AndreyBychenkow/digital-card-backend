import { describe, expect, it, vi } from 'vitest';
import { AchievementsLoader } from './achievements.loader.js';
import type { ExperienceService } from './experience.service.js';

describe('AchievementsLoader', () => {
  it('loads achievements for several experiences with a single service call', async () => {
    const findAchievementsByExperienceIds = vi.fn((_ids: number[]) =>
      Promise.resolve(new Map([[1, [{ id: 10, text: 'Built the API' }]]])),
    );
    const loader = new AchievementsLoader({
      findAchievementsByExperienceIds,
    } as unknown as ExperienceService);

    const [first, second] = await Promise.all([loader.load(1), loader.load(2)]);

    expect(findAchievementsByExperienceIds).toHaveBeenCalledTimes(1);
    expect(findAchievementsByExperienceIds).toHaveBeenCalledWith([1, 2]);
    expect(first).toEqual([{ id: 10, text: 'Built the API' }]);
    expect(second).toEqual([]);
  });
});
