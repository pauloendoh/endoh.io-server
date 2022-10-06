import {
  CurrentUser,
  Get,
  JsonController,
  QueryParam,
} from "routing-controllers"
import { User } from "../../entities/User"
import { FlashnotesService } from "./FlashnotesService"

@JsonController()
export class FlashnotesController {
  constructor(private flashnotesService = new FlashnotesService()) {}

  @Get("/flashnotes/search")
  async searchFlashnotes(
    @CurrentUser({ required: true })
    user: User,
    @QueryParam("q", { required: true }) q: string
  ) {
    return this.flashnotesService.searchFlashnotes(q, user.id)
  }
}
