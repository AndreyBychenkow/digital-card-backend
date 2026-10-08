import { Injectable } from '@nestjs/common';
import type { SkillCategory } from '../generated/prisma/enums.js';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class SkillsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** An `undefined` category is ignored by Prisma, so it means "no filter". */
  findByProfileId(profileId: number, category?: SkillCategory) {
    return this.prisma.skill.findMany({
      where: { profileId, category },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
