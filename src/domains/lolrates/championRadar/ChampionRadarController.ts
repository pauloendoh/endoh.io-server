import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  NotFoundError,
  Post,
  Put,
} from "routing-controllers"
import { getRepository } from "typeorm"
import { ChampionRadar } from "../../../entities/LolRates/ChampionRadar"
import { User } from "../../../entities/User"

@JsonController("/lolrates/championRadar")
export class ChampionRadarController {
  constructor(private radarRepo = getRepository(ChampionRadar)) {}

  @Get("/")
  async getChampionRadars(@CurrentUser({ required: true }) user: User) {
    return this.radarRepo.find({
      where: { userId: user.id },
    })
  }

  @Post("/")
  async createChampionRadar(
    @CurrentUser({ required: true }) user: User,
    @Body({ required: true }) sentRadar: ChampionRadar
  ) {
    sentRadar.userId = user.id

    return this.radarRepo.save(sentRadar)
  }

  @Put("/")
  async updateChampionRadar(
    @CurrentUser({ required: true }) user: User,
    @Body({ required: true }) sentRadar: ChampionRadar
  ) {
    const found = await this.radarRepo.findOne({
      where: { id: sentRadar.id, userId: user.id },
    })
    if (!found) throw new NotFoundError("Not owner or not exists.")

    return this.radarRepo.save(sentRadar)
  }
}
