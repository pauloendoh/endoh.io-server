import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql"
import { isAuth } from "../../../middlewares/typegraphql/isAuth"
import { MyContext } from "../../../middlewares/typegraphql/MyContext"
import LinkPreviewService from "./LinkPreviewService"
import { LinkPreviewDto } from "./types/LinkPreviewDto"

@Resolver()
export class LinkPreviewResolver {
  @Query(() => LinkPreviewDto)
  @UseMiddleware(isAuth)
  async getLinkPreview(@Ctx() { req }: MyContext, @Arg("url") url: string) {
    const service = new LinkPreviewService()

    return await service.getLinkPreview(url, req.user.id)
  }
}
