import { UserAramChampion } from "../../../entities/LolRates/UserAramChampion"
import { AramRepository } from "./AramRepository"
import { $ScrapePlayerAramStats } from "./use-case/$ScrapePlayerAramStats/$ScrapePlayerAramStats"

export class AramService {
  constructor(
    private aramRepository = new AramRepository(),
    private $scrapePlayerAramStats = new $ScrapePlayerAramStats()
  ) {}

  // PE 1/3 - these methods names are not very explicit
  async findAramWinRates(playerLolGraphsUrl?: string) {
    let generalAramWinRates = await this.aramRepository.findAramWinRates()

    if (playerLolGraphsUrl) {
      const lolGraphsData = await this.$scrapePlayerAramStats.exec(
        playerLolGraphsUrl
      )
      generalAramWinRates = generalAramWinRates.map((general) => {
        const myAramChampion = lolGraphsData.find(
          (d) => d.championName === general.championName
        )

        return {
          ...general,
          myPlayedCount: myAramChampion?.played || 0,
          myWinRate: myAramChampion?.winRate || 0,
        }
      })
    }

    return generalAramWinRates
  }

  async findUserAramChampions(userId: number) {
    return this.aramRepository.findUserAramChampions(userId)
  }

  async saveUserAramChampion(userId: number, data: UserAramChampion) {
    const userAramChampion = await this.aramRepository.findByUserAndChampionId(
      userId,
      data.championId
    )

    if (userAramChampion) {
      data.id = userAramChampion.id
    }

    return this.aramRepository.saveUserAramChampion(userId, data)
  }
}
