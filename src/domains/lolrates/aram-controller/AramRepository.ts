import { dataSource } from "../../../dataSource"
import { UserAramChampion } from "../../../entities/LolRates/UserAramChampion"

export class AramRepository {
  constructor(private db = dataSource) {}

  async findAramWinRates(): Promise<{
    championName: string
    aramWin: number
    iconUrl: string
  }> {
    return this.db.query(`
    SELECT "championName", 
           "iconUrl", 
           max("aramWin") as "aramWin"

      FROM lol_rate lr 
     WHERE "aramWin" IS NOT NULL
  GROUP BY "championName", "iconUrl"
  ORDER BY max("aramWin") DESC
    `)
  }

  async findUserAramChampions(userId: number) {
    return this.db.getRepository(UserAramChampion).find({
      where: {
        userId,
      },
    })
  }

  async findByUserAndChampionId(userId: number, championId: number) {
    return this.db.getRepository(UserAramChampion).findOne({
      where: {
        userId,
        championId,
      },
    })
  }

  async saveUserAramChampion(userId: number, data: UserAramChampion) {
    return this.db.getRepository(UserAramChampion).save({
      ...data,
      id: data.id || undefined,
      userId,
    })
  }
}
