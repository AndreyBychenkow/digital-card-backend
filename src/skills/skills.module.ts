import { Module } from '@nestjs/common';
import { SkillsRepository } from './skills.repository.js';
import { SkillsResolver } from './skills.resolver.js';
import { SkillsService } from './skills.service.js';

@Module({
  providers: [SkillsRepository, SkillsService, SkillsResolver],
})
export class SkillsModule {}
