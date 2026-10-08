import { Injectable } from '@nestjs/common';
import type { Experience } from '../generated/prisma/client.js';
import { countMonths, formatPeriod } from './experience-period.js';
import { ExperienceModel } from './models/experience.model.js';
import { ExperienceRepository } from './experience.repository.js';

@Injectable()
export class ExperienceService {
  constructor(private readonly experiences: ExperienceRepository) {}

  async findForProfile(profileId: number, now: Date = new Date()): Promise<ExperienceModel[]> {
    const rows = await this.experiences.findByProfileId(profileId);
    return rows.map((row) => toExperienceModel(row, now));
  }
}

function toExperienceModel(row: Experience, now: Date): ExperienceModel {
  return {
    id: row.id,
    company: row.company,
    position: row.position,
    description: row.description,
    startDate: row.startDate,
    endDate: row.endDate,
    period: formatPeriod(row.startDate, row.endDate),
    isCurrent: row.endDate === null,
    durationMonths: countMonths(row.startDate, row.endDate, now),
  };
}
