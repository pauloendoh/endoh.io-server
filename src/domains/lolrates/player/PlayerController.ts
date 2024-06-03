import {
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
} from "routing-controllers"
import { Player } from "../../../entities/LolRates/Player"
import { User } from "../../../entities/User"
import PlayerRepo from "../../../repositories/lolrates/PlayerRepo"

@JsonController("/lolrates/player")
export class PlayerController {
  constructor(private playerRepo = PlayerRepo) {}

  @Get("/")
  async getPlaces(@CurrentUser({ required: true }) user: User) {
    return this.playerRepo.findAllFullByUserId(user.id)
  }

  @Post("/")
  async savePlace(
    @CurrentUser({ required: true }) user: User,
    @Body() sentPlayer: Player
  ) {
    const saved = await this.playerRepo.save({
      ...sentPlayer,
      userId: user.id,
    })
    return this.playerRepo.findOneFull(saved.id)
  }
}
