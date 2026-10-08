import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { SkillCategory } from '../generated/prisma/enums.js';
import { ProfileModel } from '../profile/models/profile.model.js';
import { SkillModel } from './models/skill.model.js';
import { SkillsService } from './skills.service.js';

@Resolver(() => ProfileModel)
export class SkillsResolver {
  constructor(private readonly skillsService: SkillsService) {}

  @ResolveField(() => [SkillModel], {
    description: 'Skills of the owner, optionally filtered by category.',
  })
  skills(
    @Parent() profile: ProfileModel,
    @Args('category', { type: () => SkillCategory, nullable: true }) category?: SkillCategory,
  ): Promise<SkillModel[]> {
    return this.skillsService.findForProfile(profile.id, category);
  }
}
