import { Injectable } from '@nestjs/common';
import type { ExperienceModel } from '../generated/prisma/models.js';
import type { AchievementModel } from '../generated/prisma/models.js';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileId(profileId: number): Promise<ExperienceModel[]> {
    return this.prisma.experience.findMany({
      where: { profileId },
      orderBy: [{ startDate: 'desc' }, { id: 'asc' }],
    });
  }

  /** One query for many experiences. Used by the achievements DataLoader to avoid N+1. */
  findAchievementsByExperienceIds(experienceIds: number[]): Promise<AchievementModel[]> {
    return this.prisma.achievement.findMany({
      where: { experienceId: { in: experienceIds } },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
