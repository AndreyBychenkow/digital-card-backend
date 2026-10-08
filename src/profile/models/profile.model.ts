import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Profile', { description: 'Public profile of the card owner.' })
export class ProfileModel {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  title: string;

  @Field({ description: 'Short bio.' })
  description: string;

  @Field(() => String, { nullable: true })
  location: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'What kind of job the owner is looking for now.',
  })
  availability: string | null;
}
