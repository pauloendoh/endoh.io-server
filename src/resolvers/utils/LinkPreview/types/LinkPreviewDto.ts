import { Field, ObjectType } from "type-graphql";
import { Resource } from "../../../../entities/relearn/Resource";

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

  @Field()
  youtubeVideoLength: string;

  @Field(() => Resource, { nullable: true })
  alreadySavedResource: Resource | null;
}

export const buildLinkPreviewDto = (
  p?: Partial<LinkPreviewDto>
): LinkPreviewDto => ({
  title: "",
  image: "",
  description: "",
  url: "",
  youtubeVideoLength: "00:00h",
  alreadySavedResource: null,
  ...p,
});
