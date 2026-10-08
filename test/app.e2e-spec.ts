import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/database/prisma.service.js';
import { profileData } from '../src/database/seed/profile.data.js';
import { syncProfile } from '../src/database/seed/sync-profile.js';
import { ExperienceRepository } from '../src/experience/experience.repository.js';

/** The query from the technical specification. */
const SPEC_QUERY = `query {
  profile {
    name
    description
    skills { name }
    experience { company position }
    projects { name }
  }
}`;

describe('Digital card API', () => {
  let app: INestApplication;

  const graphql = (query: string) => request(app.getHttpServer()).post('/graphql').send({ query });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('reports a healthy database on /health', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok', database: 'up' });
  });

  it('answers the query from the specification', async () => {
    const res = await graphql(SPEC_QUERY).expect(200);

    expect(res.body.errors).toBeUndefined();
    const { profile } = res.body.data;
    expect(profile.name).toBe(profileData.name);
    expect(profile.description).toBe(profileData.description);
    expect(profile.skills).toHaveLength(profileData.skills.length);
    expect(profile.experience).toHaveLength(profileData.experiences.length);
    expect(profile.projects).toHaveLength(profileData.projects.length);
  });

  it('nests achievements under each job and loads them in one batch', async () => {
    const repository = app.get(ExperienceRepository);
    const spy = vi.spyOn(repository, 'findAchievementsByExperienceIds');

    const res = await graphql(
      '{ profile { experience { company achievements { id text } } } }',
    ).expect(200);

    expect(res.body.errors).toBeUndefined();
    // Two jobs, one database query for their achievements.
    expect(spy).toHaveBeenCalledTimes(1);
    const jobs: Array<{ achievements: Array<{ text: string }> }> = res.body.data.profile.experience;
    const expected = profileData.experiences.reduce((sum, job) => sum + job.achievements.length, 0);
    expect(jobs.reduce((sum, job) => sum + job.achievements.length, 0)).toBe(expected);
    spy.mockRestore();
  });

  it('filters skills by category', async () => {
    const res = await graphql('{ profile { skills(category: TESTING) { name category } } }').expect(
      200,
    );

    const skills: Array<{ category: string }> = res.body.data.profile.skills;
    expect(skills.length).toBeGreaterThan(0);
    expect(skills.every((skill) => skill.category === 'TESTING')).toBe(true);
  });

  it('exposes links, education and periods of work', async () => {
    const res = await graphql(`
      {
        profile {
          links {
            kind
            url
          }
          education {
            institution
            graduationYear
          }
          experience {
            period
            isCurrent
            durationMonths
          }
        }
      }
    `).expect(200);

    const { profile } = res.body.data;
    expect(profile.links).toHaveLength(profileData.links.length);
    expect(profile.education).toHaveLength(profileData.educations.length);
    expect(profile.experience[0].period).toEqual(expect.any(String));
    expect(profile.experience[0].durationMonths).toBeGreaterThan(0);
  });

  it('rejects unknown fields with a validation error', async () => {
    const res = await graphql('{ profile { noSuchField } }');

    expect(res.body.errors[0].extensions.code).toBe('GRAPHQL_VALIDATION_FAILED');
  });

  it('serves Apollo Sandbox on GET /graphql', async () => {
    const res = await request(app.getHttpServer())
      .get('/graphql')
      .set('Accept', 'text/html')
      .expect(200);

    expect(res.text).toContain('embeddable-sandbox');
  });

  it('keeps the data the same after a second sync', async () => {
    const prisma = app.get(PrismaService);

    await syncProfile(prisma, profileData);
    await syncProfile(prisma, profileData);

    const res = await graphql(
      '{ profile { skills { name } experience { achievements { id } } } }',
    ).expect(200);
    expect(res.body.data.profile.skills).toHaveLength(profileData.skills.length);
  });
});
