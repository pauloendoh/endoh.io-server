import { IsDateString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export default class LearningAddInput {
  @Field()
  description: string;

  @Field()
  isHighlight: boolean;

  @Field()
  @IsDateString()
  date: string;
}
