import { CurrentUser, Get, JsonController } from "routing-controllers"
import { dataSource } from "../../../dataSource"
import { Champion } from "../../../entities/LolRates/Champion"
import { User } from "../../../entities/User"

@JsonController("/lolrates/champion")
export class ChampionController {
  constructor(private championRepo = dataSource.getRepository(Champion)) {}

  @Get("/")
  async getChampions(@CurrentUser({ required: true }) _: User) {
    return this.championRepo.find({ order: { name: "ASC" } })
  }
}
