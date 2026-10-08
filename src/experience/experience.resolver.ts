import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ProfileModel } from '../profile/models/profile.model.js';
import { ExperienceModel } from './models/experience.model.js';
import { ExperienceService } from './experience.service.js';

@Resolver(() => ProfileModel)
export class ProfileExperienceResolver {
  constructor(private readonly experienceService: ExperienceService) {}

  @ResolveField(() => [ExperienceModel], {
    description: 'Work experience, most recent first.',
  })
  experience(@Parent() profile: ProfileModel): Promise<ExperienceModel[]> {
    return this.experienceService.findForProfile(profile.id);
  }
}
