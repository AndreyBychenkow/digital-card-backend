import type { PrismaClient } from '../../generated/prisma/client.js';
import type { ProfileSeedData } from './profile.data.js';

/** Arbitrary key for the advisory lock that stops two instances from seeding at the same time. */
const SEED_LOCK_KEY = 'digital-card:profile-seed';

export interface SyncResult {
  links: number;
  skills: number;
  experiences: number;
  projects: number;
  educations: number;
}

/**
 * Makes the database match `data`. It is safe to run on every start:
 * the profile row is upserted by slug and its child rows are replaced.
 * Everything happens in one transaction, so a reader never sees half of the profile.
 *
 * Child rows get new ids on each sync. Nothing outside the app should rely on them.
 */
export function syncProfile(prisma: PrismaClient, data: ProfileSeedData): Promise<SyncResult> {
  return prisma.$transaction(
    async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${SEED_LOCK_KEY}))::text`;

      const profile = await tx.profile.upsert({
        where: { slug: data.slug },
        create: {
          slug: data.slug,
          name: data.name,
          title: data.title,
          description: data.description,
          location: data.location,
          availability: data.availability,
        },
        update: {
          name: data.name,
          title: data.title,
          description: data.description,
          location: data.location,
          availability: data.availability,
        },
      });
      const profileId = profile.id;

      await tx.profileLink.deleteMany({ where: { profileId } });
      await tx.profileLink.createMany({
        data: data.links.map((link, index) => ({ ...link, profileId, sortOrder: index })),
      });

      await tx.skill.deleteMany({ where: { profileId } });
      await tx.skill.createMany({
        data: data.skills.map((skill, index) => ({ ...skill, profileId, sortOrder: index })),
      });

      // Achievements are removed by the cascade on Experience.
      await tx.experience.deleteMany({ where: { profileId } });
      for (const job of data.experiences) {
        await tx.experience.create({
          data: {
            profileId,
            company: job.company,
            position: job.position,
            description: job.description,
            startDate: new Date(job.startDate),
            endDate: job.endDate ? new Date(job.endDate) : null,
            achievements: {
              create: job.achievements.map((text, index) => ({ text, sortOrder: index })),
            },
          },
        });
      }

      await tx.project.deleteMany({ where: { profileId } });
      await tx.project.createMany({
        data: data.projects.map((project, index) => ({ ...project, profileId, sortOrder: index })),
      });

      await tx.education.deleteMany({ where: { profileId } });
      await tx.education.createMany({
        data: data.educations.map((education, index) => ({
          ...education,
          profileId,
          sortOrder: index,
        })),
      });

      return {
        links: data.links.length,
        skills: data.skills.length,
        experiences: data.experiences.length,
        projects: data.projects.length,
        educations: data.educations.length,
      };
    },
    { timeout: 30_000 },
  );
}
