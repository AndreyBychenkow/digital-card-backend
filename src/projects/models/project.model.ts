import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Project', { description: 'A project the owner built or took part in.' })
export class ProjectModel {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => String, {
    nullable: true,
    description: 'Link to the project or to its repository.',
  })
  url: string | null;

  @Field(() => [String])
  technologies: string[];
}
