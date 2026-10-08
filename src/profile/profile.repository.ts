import { Injectable } from '@nestjs/common';
import type { EducationModel, ProfileLinkModel, ProfileModel } from '../generated/prisma/models.js';
import { PrismaService } from '../database/prisma.service.js';

/** Data access only. No business rules here. */
@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findBySlug(slug: string): Promise<ProfileModel | null> {
    return this.prisma.profile.findUnique({ where: { slug } });
  }

  findLinks(profileId: number): Promise<ProfileLinkModel[]> {
    return this.prisma.profileLink.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findEducation(profileId: number): Promise<EducationModel[]> {
    return this.prisma.education.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
