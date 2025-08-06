import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
  QueryParam,
} from "routing-controllers"
import { UserAramChampion } from "../../../entities/LolRates/UserAramChampion"
import { User } from "../../../entities/User"
import { AramService } from "./AramService"

@JsonController()
export class AramChampionController {
  constructor(private aramService = new AramService()) {}

  @Get("/aram-champions-win-rates")
  async findAramWinRates(@QueryParam("lolgraphsUrl") lolgraphsUrl?: string) {
    const aramWinRates = await this.aramService.findAramWinRates(lolgraphsUrl)
    return aramWinRates
  }

  @Get("/my-aram-champions")
  async findUserAramChampions(@CurrentUser({ required: true }) user: User) {
    const userAramChampions = await this.aramService.findUserAramChampions(
      user.id
    )
    return userAramChampions
  }

  @Post("/my-aram-champions")
  async saveUserAramChampion(
    @CurrentUser({ required: true }) user: User,
    @Body() data: UserAramChampion
  ) {
    return this.aramService.saveUserAramChampion(user.id, data)
  }
}
