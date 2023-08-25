import { UserAramChampion } from "../../../entities/LolRates/UserAramChampion"
import { AramRepository } from "./AramRepository"
import { _CacheLolGraphAramStats } from "./use-case/_CacheLolGraphAramStats/_CacheLolGraphAramStats"

export class AramService {
  constructor(
    private aramRepository = new AramRepository(),
    private _cacheLolGraphAramStats = new _CacheLolGraphAramStats()
  ) {}

  async findAramWinRates(lolgraphsUrl?: string) {
    let generalAramWinRates = await this.aramRepository.findAramWinRates()

    if (lolgraphsUrl) {
      const lolGraphsData = await this._cacheLolGraphAramStats.exec(
        lolgraphsUrl
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
