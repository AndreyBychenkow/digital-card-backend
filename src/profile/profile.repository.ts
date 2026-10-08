import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

/** Data access only. No business rules here. */
@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findBySlug(slug: string) {
    return this.prisma.profile.findUnique({ where: { slug } });
  }

  findLinks(profileId: number) {
    return this.prisma.profileLink.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findEducation(profileId: number) {
    return this.prisma.education.findMany({
      where: { profileId },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
