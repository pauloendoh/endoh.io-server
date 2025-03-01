import { Get, JsonController, QueryParam } from "routing-controllers"
import LolRateRepository from "../../../repositories/lolrates/LolRateRepository"
import { LolRatesService } from "./LolRatesService"

@JsonController()
export class LolRatesController {
  constructor(
    private readonly lolRateRepo = LolRateRepository,
    private readonly lolratesService = new LolRatesService()
  ) {}

  @Get("/lolRates")
  async getLolRates() {
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
    @QueryParam("offsetHours")
    offsetHours: number,
    @QueryParam("summonerName")
    summonerName: string,
    @QueryParam("startingWeekday")
    startingWeekday: number = 1
  ) {
    const data = await this.lolratesService.getPlaytime({
      offsetHours,
      summonerName,
      startingWeekday,
    })

    return {
      playedMinutes: data.playtimeInMinutes,
      playedHours: data.playtimeInHours,
    }
  }
}
