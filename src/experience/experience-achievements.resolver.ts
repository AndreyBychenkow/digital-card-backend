import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AchievementsLoader } from './achievements.loader.js';
import { AchievementModel } from './models/achievement.model.js';
import { ExperienceModel } from './models/experience.model.js';

@Resolver(() => ExperienceModel)
export class ExperienceAchievementsResolver {
  constructor(private readonly achievementsLoader: AchievementsLoader) {}

  @ResolveField(() => [AchievementModel], { description: 'What the owner achieved in this job.' })
  achievements(@Parent() experience: ExperienceModel): Promise<AchievementModel[]> {
    return this.achievementsLoader.load(experience.id);
  }
}
