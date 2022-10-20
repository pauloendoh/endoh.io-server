import {
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
} from "routing-controllers"
import { dataSource } from "../../../dataSource"
import { PlayerChampion } from "../../../entities/LolRates/PlayerChampion"
import { User } from "../../../entities/User"

@JsonController("/lolrates/playerChampion")
export class PlayerChampionController {
  constructor(
    private playerChampionRepo = dataSource.getRepository(PlayerChampion)
  ) {}

  @Post("/")
  async savePlayerChampion(
    @CurrentUser({ required: true }) user: User,
    @Body() sentPlayerChampion: PlayerChampion
  ) {
    sentPlayerChampion.userId = user.id

    const found = await this.playerChampionRepo.findOne({
      where: {
        playerId: sentPlayerChampion.playerId,
        championId: sentPlayerChampion.championId,
        role: sentPlayerChampion.role,
        userId: user.id,
      },
    })

    if (found) {
      const saved = await this.playerChampionRepo.save({
        ...found,
        skillLevel: sentPlayerChampion.skillLevel,
      })
      return saved
    }

    const saved = await this.playerChampionRepo.save(sentPlayerChampion)
    return saved
  }

  @Get("/")
  async getPlayerChampions(@CurrentUser({ required: true }) user: User) {
    return this.playerChampionRepo.find({
      where: { userId: user.id },
    })
  }

  @Delete("/:id")
  async deletePlayerChampion(
    @CurrentUser({ required: true }) user: User,
    @Param("id") id: number
  ) {
    const found = await this.playerChampionRepo.findOneOrFail({
      where: { userId: user.id, id },
    })

    await this.playerChampionRepo.delete(found)

    return true
  }
}
