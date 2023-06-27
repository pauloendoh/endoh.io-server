import { IsDateString, IsNumber } from "class-validator"
import { Field, Float, InputType } from "type-graphql"

@InputType()
export default class LearningInput {
  @Field({ nullable: true })
  id?: number

  @Field()
  description: string

  @Field()
  isHighlight: boolean

  @Field()
  @IsDateString()
  datetime: string

  @Field(() => Float)
  @IsNumber()
  points: number
}
