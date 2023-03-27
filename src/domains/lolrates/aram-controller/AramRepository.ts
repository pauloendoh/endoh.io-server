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

  async saveUserAramChampion(userId: number, data: UserAramChampion) {
    const userAramChampion = new UserAramChampion()
    userAramChampion.id = data.id || undefined
    userAramChampion.userId = userId
    userAramChampion.championId = data.championId
    userAramChampion.fun = data.fun
    userAramChampion.items = data.items
    userAramChampion.runes = data.runes
    userAramChampion.extraNotes = data.extraNotes

    return this.db.getRepository(UserAramChampion).save(userAramChampion)
  }
}
