import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Achievement', { description: 'A concrete result the owner reached in a job.' })
export class AchievementModel {
  @Field(() => ID)
  id: number;

  @Field()
  text: string;
}
