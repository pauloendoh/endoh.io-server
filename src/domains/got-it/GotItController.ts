import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Put,
} from "routing-controllers"
import { User } from "../../entities/User"
import { UserGotIt } from "../../entities/UserGotIt"
import { GotItService } from "./GotItService"

@JsonController()
export class GotItController {
  constructor(private gotItService = new GotItService()) {}

  @Get("/got-it")
  async findUserGotIt(@CurrentUser({ required: true }) user: User) {
    return this.gotItService.findOrCreateUserGotIt(user.id)
  }

  @Put("/got-it")
  async updateUserGotIt(
    @CurrentUser({ required: true }) user: User,
    @Body() dto: UserGotIt
  ) {
    return this.gotItService.updateUserGotIt(dto, user.id)
  }
}
