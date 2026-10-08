import { Injectable } from '@nestjs/common';
import { ProjectModel } from './models/project.model.js';
import { ProjectsRepository } from './projects.repository.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly projects: ProjectsRepository) {}

  async findForProfile(profileId: number): Promise<ProjectModel[]> {
    const rows = await this.projects.findByProfileId(profileId);
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      url: row.url,
      technologies: row.technologies,
    }));
  }
}
