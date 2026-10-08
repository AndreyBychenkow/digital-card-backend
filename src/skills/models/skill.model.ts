import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SkillCategory } from '../../generated/prisma/enums.js';

registerEnumType(SkillCategory, {
  name: 'SkillCategory',
  description: 'Group a skill belongs to.',
});

@ObjectType('Skill', { description: 'A technology or a practice the owner works with.' })
export class SkillModel {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field(() => SkillCategory)
  category: SkillCategory;
}
