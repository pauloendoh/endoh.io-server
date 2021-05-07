import { LolRateDto } from "./../dtos/lolrates/LolRateDto"
import { DeleteResult, EntityRepository, Repository } from "typeorm"
import { UserProfileDto } from "../dtos/feed/UserProfileDto"
import { LolRate } from "../entities/LolRate"
import { User } from "../entities/User"
import { LolRoles } from "../utils/lolrates/lolRoles"
import { IChampion } from "../utils/lolrates/scrapeLolRates/scrapeChampions"
import { IOpggResult as ScrapeResult } from "../utils/lolrates/scrapeLolRates/scrapeOpgg"
import { myConsoleError } from "../utils/myConsoleError"
import { LolRateUpdatedAtDto } from "../dtos/lolrates/LolRateUpdatedAtDto"

@EntityRepository(LolRate)
export default class LolRateRepository extends Repository<LolRate> {
  async getRates(): Promise<LolRateDto[]> {
    try {
      return this.query(`
           select avgs.*,
                   (avgs."avgPick" + avgs."avgWin")/2  as "avgAvg"
	          from (select "championName",
                           "role",
                           "iconUrl",
                           "opggPick",
                           "opggWin",
                           "lolgraphsPick",
                           "lolgraphsWin",
						               "uggPick",
						               "uggWin",
                           ("opggPick" + "lolgraphsPick" + "uggPick")/3 as "avgPick",
                           ("opggWin" + "lolgraphsWin" + "uggWin")/3 as "avgWin"
                      from "lol_rate") as avgs
	          where  "avgWin" > 0
         order by "avgAvg" desc 
        `)
    } catch (err) {}
  }

  async getUpdatedAt(): Promise<LolRateUpdatedAtDto> {
    return this.query(`
            select "opggUpdatedAt",
                   "lolgraphsUpdatedAt",
                   "uggUpdatedAt"
              from "lol_rate"
             limit 1
        `)
  }

  async saveChampions(champions: IChampion[]) {
    try {
      for (const champion of champions) {
        const { name: championName, iconUrl } = champion

        const exists = await this.findOne({
          where: { championName, iconUrl },
        })

        if (!exists) {
          const roles: LolRoles[] = ["TOP", "JUNGLE", "MID", "BOT", "SUP"]
          for (const role of roles) {
            await this.save({ championName, iconUrl, role })
          }
        }
      }

      return this.find()
    } catch (err) {
      myConsoleError(err.message)
    }
  }

  async saveOpgg(results: ScrapeResult[]) {
    try {
      // resetting all from op.gg
      await this.createQueryBuilder()
        .update()
        .set({
          opggPick: null,
          opggWin: null,
          opggAvg: null,
          opggUpdatedAt: new Date().toISOString(),
        })
        .execute()

      for (const { role, championName, pickRate, winRate } of results) {
        const opggPick = Number(pickRate.trim().replace(/%/g, ""))
        const opggWin = Number(winRate.trim().replace(/%/g, ""))
        const opggAvg = Number((opggPick + opggWin) / 2)

        await this.createQueryBuilder()
          .update()
          .set({
            opggPick,
            opggWin,
            opggAvg,
            opggUpdatedAt: new Date().toISOString(),
          })
          .where("championName = :championName", { championName })
          .andWhere("role = :role", { role })
          .execute()
      }
    } catch (err) {
      myConsoleError(err.message)
    }
  }

  async saveLolGraphs(results: ScrapeResult[]) {
    try {
      // resetting all from op.gg
      await this.createQueryBuilder()
        .update()
        .set({
          lolgraphsPick: null,
          lolgraphsWin: null,
          lolgraphsAvg: null,
          lolgraphsUpdatedAt: new Date().toISOString(),
        })
        .execute()

      for (const { role, championName, pickRate, winRate } of results) {
        const lolgraphsPick = Number(pickRate.trim().replace(/%/g, ""))
        const lolgraphsWin = Number(winRate.trim().replace(/%/g, ""))
        const lolgraphsAvg = Number((lolgraphsPick + lolgraphsWin) / 2)

        await this.createQueryBuilder()
          .update()
          .set({
            lolgraphsPick,
            lolgraphsWin,
            lolgraphsAvg,
            lolgraphsUpdatedAt: new Date().toISOString(),
          })
          .where("championName = :championName", { championName })
          .andWhere("role = :role", { role })
          .execute()
      }
    } catch (err) {
      myConsoleError(err.message)
    }
  }

  async saveUgg(results: ScrapeResult[]) {
    try {
      // resetting all from op.gg
      await this.createQueryBuilder()
        .update()
        .set({
          uggPick: null,
          uggWin: null,
          uggAvg: null,
          uggUpdatedAt: new Date().toISOString(),
        })
        .execute()

      for (const { role, championName, pickRate, winRate } of results) {
        const uggPick = Number(pickRate.trim().replace(/%/g, ""))
        const uggWin = Number(winRate.trim().replace(/%/g, ""))
        const uggAvg = Number((uggPick + uggWin) / 2)

        await this.createQueryBuilder()
          .update()
          .set({
            uggPick,
            uggWin,
            uggAvg,
            uggUpdatedAt: new Date().toISOString(),
          })
          .where("championName = :championName", { championName })
          .andWhere("role = :role", { role })
          .execute()
      }
    } catch (err) {
      myConsoleError(err.message)
    }
  }
}
