import { IsDateString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export default class LearningInput {
  @Field({ nullable: true })
  id?: number;

  @Field()
  description: string;

  @Field()
  isHighlight: boolean;

  @Field()
  @IsDateString()
  datetime: string;
}
