import { Injectable } from '@nestjs/common';
import type { ProjectModel } from '../generated/prisma/models.js';
import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileId(profileId: number): Promise<ProjectModel[]> {
    return this.prisma.project.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
