import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Education', { description: 'Higher education entry.' })
export class EducationModel {
  @Field(() => ID)
  id: number;

  @Field()
  institution: string;

  @Field()
  degree: string;

  @Field(() => String, { nullable: true })
  specialty: string | null;

  @Field(() => Int)
  graduationYear: number;
}
