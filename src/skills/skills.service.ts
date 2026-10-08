import { Injectable } from '@nestjs/common';
import type { SkillCategory } from '../generated/prisma/enums.js';
import { SkillModel } from './models/skill.model.js';
import { SkillsRepository } from './skills.repository.js';

@Injectable()
export class SkillsService {
  constructor(private readonly skills: SkillsRepository) {}

  async findForProfile(profileId: number, category?: SkillCategory): Promise<SkillModel[]> {
    const rows = await this.skills.findByProfileId(profileId, category);
    return rows.map((row) => ({ id: row.id, name: row.name, category: row.category }));
  }
}
