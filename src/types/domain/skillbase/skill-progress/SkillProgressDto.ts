import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class SkillProgressDto {
  @Field()
  skillId: number;

  @Field()
  previousName: string;

  @Field()
  currentName: string;

  @Field({ nullable: true })
  previousLevel: number;

  @Field()
  currentLevel: number;

  @Field()
  levelImprovement: number;
}
