import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileId(profileId: number) {
    return this.prisma.experience.findMany({
      where: { profileId },
      orderBy: [{ startDate: 'desc' }, { id: 'asc' }],
    });
  }

  /** One query for many experiences. Used by the achievements DataLoader to avoid N+1. */
  findAchievementsByExperienceIds(experienceIds: number[]) {
    return this.prisma.achievement.findMany({
      where: { experienceId: { in: experienceIds } },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
