import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class LinkPreviewDto {
  @Field()
  title: string;

  @Field()
  image: string;

  @Field()
  description: string;

  @Field()
  url: string;
}
