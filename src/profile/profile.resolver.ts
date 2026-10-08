import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { EducationModel } from './models/education.model.js';
import { ProfileLinkModel } from './models/profile-link.model.js';
import { ProfileModel } from './models/profile.model.js';
import { ProfileService } from './profile.service.js';

@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => ProfileModel, { description: 'The profile of the card owner.' })
  profile(): Promise<ProfileModel> {
    return this.profileService.getOwnerProfile();
  }

  @ResolveField(() => [ProfileLinkModel], {
    description: 'GitHub, Telegram, e-mail and other professional links.',
  })
  links(@Parent() profile: ProfileModel): Promise<ProfileLinkModel[]> {
    return this.profileService.getLinks(profile.id);
  }

  @ResolveField(() => [EducationModel], { description: 'Education.' })
  education(@Parent() profile: ProfileModel): Promise<EducationModel[]> {
    return this.profileService.getEducation(profile.id);
  }
}
