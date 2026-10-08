import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { ExperienceService } from './experience.service.js';
import { AchievementModel } from './models/achievement.model.js';

/**
 * Batches achievement lookups inside one GraphQL request. Without it, a list of
 * jobs would run one query per job (the N+1 problem); with it, every job asked
 * for in the same request is loaded by a single query.
 *
 * Request scope gives each request its own cache, so no data leaks between clients.
 */
@Injectable({ scope: Scope.REQUEST })
export class AchievementsLoader {
  private readonly loader: DataLoader<number, AchievementModel[]>;

  constructor(private readonly experiences: ExperienceService) {
    this.loader = new DataLoader<number, AchievementModel[]>(async (experienceIds) => {
      const byExperience = await this.experiences.findAchievementsByExperienceIds([
        ...experienceIds,
      ]);
      // DataLoader requires one result per key, in the same order as the keys.
      return experienceIds.map((experienceId) => byExperience.get(experienceId) ?? []);
    });
  }

  load(experienceId: number): Promise<AchievementModel[]> {
    return this.loader.load(experienceId);
  }
}
