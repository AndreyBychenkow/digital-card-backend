import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LinkKind } from '../../generated/prisma/enums.js';

registerEnumType(LinkKind, {
  name: 'LinkKind',
  description: 'Kind of a link shown on the profile.',
});

@ObjectType('ProfileLink', { description: 'A link to a professional resource.' })
export class ProfileLinkModel {
  @Field(() => LinkKind)
  kind: LinkKind;

  @Field()
  label: string;

  @Field()
  url: string;
}
