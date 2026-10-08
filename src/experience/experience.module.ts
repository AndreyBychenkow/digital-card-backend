import { Module } from '@nestjs/common';
import { AchievementsLoader } from './achievements.loader.js';
import { ExperienceAchievementsResolver } from './experience-achievements.resolver.js';
import { ExperienceRepository } from './experience.repository.js';
import { ExperienceService } from './experience.service.js';
import { ProfileExperienceResolver } from './experience.resolver.js';

@Module({
  providers: [
    ExperienceRepository,
    ExperienceService,
    ProfileExperienceResolver,
    AchievementsLoader,
    ExperienceAchievementsResolver,
  ],
})
export class ExperienceModule {}
