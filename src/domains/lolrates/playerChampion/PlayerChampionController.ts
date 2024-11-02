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
import LolRateRepository from "../../../repositories/lolrates/LolRateRepository"

@JsonController("/lolrates/playerChampion")
export class PlayerChampionController {
  constructor(
    private readonly playerChampionRepo = dataSource.getRepository(
      PlayerChampion
    ),
    private readonly lolRateRepository = LolRateRepository
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
    const playerchampions = await this.playerChampionRepo.find({
      where: { userId: user.id },
      relations: ["champion"],
    })

    const championNames = playerchampions.map((pc) => pc.champion.name)

    const winRates = await this.lolRateRepository.findWinrates({
      championNames,
    })

    return playerchampions.map((pc) => ({
      ...pc,
      rate: winRates.find(
        (wr) => wr.championName === pc.champion.name && wr.role === pc.role
      ),
    }))
  }

  @Delete("/:id")
  async deletePlayerChampion(
    @CurrentUser({ required: true }) user: User,
    @Param("id") id: number
  ) {
    const found = await this.playerChampionRepo.findOneOrFail({
      where: { userId: user.id, id },
    })
    if (!found) {
      return false
    }

    await this.playerChampionRepo.delete({
      id: found.id,
    })

    return true
  }
}
