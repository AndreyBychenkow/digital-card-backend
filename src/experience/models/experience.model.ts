import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Experience', { description: 'A job the owner has worked at.' })
export class ExperienceModel {
  @Field(() => ID)
  id: number;

  @Field()
  company: string;

  @Field()
  position: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => Date, { description: 'First day of the start month.' })
  startDate: Date;

  @Field(() => Date, {
    nullable: true,
    description: 'First day of the last month of work. Null while the job is ongoing.',
  })
  endDate: Date | null;

  @Field({ description: 'Human-readable period, for example "Февраль 2026 — Август 2026".' })
  period: string;

  @Field({ description: 'True if the owner still works there.' })
  isCurrent: boolean;

  @Field(() => Int, { description: 'Calendar months, start and end month included.' })
  durationMonths: number;
}
