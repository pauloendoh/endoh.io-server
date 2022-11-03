import { Field, ObjectType } from "type-graphql"
import { Resource } from "../../../../entities/relearn/Resource"

@ObjectType()
export class LinkPreviewDto {
  @Field({ nullable: true })
  title: string

  @Field({ nullable: true })
  image: string

  @Field({ nullable: true })
  description: string

  @Field({ nullable: true })
  url: string

  @Field({ nullable: true })
  youtubeVideoLength: string

  @Field({ nullable: true })
  viewCount: number

  @Field(() => Resource, { nullable: true })
  alreadySavedResource: Resource | null
}

export const buildLinkPreviewDto = (
  p?: Partial<LinkPreviewDto>
): LinkPreviewDto => ({
  title: "",
  image: "",
  description: "",
  url: "",
  youtubeVideoLength: "00:00h",
  viewCount: 0,
  alreadySavedResource: null,
  ...p,
})
