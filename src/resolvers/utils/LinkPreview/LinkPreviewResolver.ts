import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql"
import { isAuth } from "../../../middlewares/typegraphql/isAuth"
import { MyContext } from "../../../middlewares/typegraphql/MyContext"
import LinkPreviewService from "./LinkPreviewService"
import { LinkPreviewDto } from "./types/LinkPreviewDto"

// PE 1/3 - remove?
@Resolver()
export class LinkPreviewResolver {
  constructor(private linkPreviewService = new LinkPreviewService()) {}

  @Query(() => LinkPreviewDto)
  @UseMiddleware(isAuth)
  async getLinkPreview(@Ctx() { req }: MyContext, @Arg("url") url: string) {
    return await this.linkPreviewService.getLinkPreview(url, req.user.id)
  }
}
