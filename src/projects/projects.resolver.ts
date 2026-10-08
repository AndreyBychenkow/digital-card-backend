import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ProfileModel } from '../profile/models/profile.model.js';
import { ProjectModel } from './models/project.model.js';
import { ProjectsService } from './projects.service.js';

@Resolver(() => ProfileModel)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @ResolveField(() => [ProjectModel], { description: 'Projects, in the order set by the owner.' })
  projects(@Parent() profile: ProfileModel): Promise<ProjectModel[]> {
    return this.projectsService.findForProfile(profile.id);
  }
}
