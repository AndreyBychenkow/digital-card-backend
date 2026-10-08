import { Module } from '@nestjs/common';
import { ExperienceRepository } from './experience.repository.js';
import { ExperienceService } from './experience.service.js';
import { ProfileExperienceResolver } from './experience.resolver.js';

@Module({
  providers: [ExperienceRepository, ExperienceService, ProfileExperienceResolver],
})
export class ExperienceModule {}
