import {
  CurrentUser,
  Get,
  JsonController,
  QueryParam,
} from "routing-controllers"
import { User } from "../../../entities/User"
import LolRateRepository from "../../../repositories/lolrates/LolRateRepository"
import { LolRatesService } from "./LolRatesService"

@JsonController()
export class LolRatesController {
  constructor(
    private lolRateRepo = LolRateRepository,
    private lolratesService = new LolRatesService()
  ) {}

  @Get("/lolRates")
  async getDocs() {
    const allWinrates = (await this.lolRateRepo.findWinrates()).map((item) => {
      let count = 0
      if (item.uggWin) count++
      if (item.opggWin) count++
      if (item.lolgraphsWin) count++

      return {
        ...item,
        avgWin: (item.uggWin + item.opggWin + item.lolgraphsWin) / count,
        avgPick: (item.uggPick + item.uggPick + item.lolgraphsPick) / count,
      }
    })

    const updatedAt = await this.lolRateRepo.getUpdatedAt()

    return { rates: allWinrates, updatedAt: updatedAt[0] }
  }

  @Get("/playtime")
  async getPlaytime(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("offsetHours")
    offsetHours: number,

    @QueryParam("summonerName")
    summonerName: string
  ) {
    const data = await this.lolratesService.getPlaytime(
      offsetHours,
      summonerName
    )

    return {
      playedMinutes: data.playtimeInMinutes,
      playedHours: data.playtimeInHours,
    }
  }
}
