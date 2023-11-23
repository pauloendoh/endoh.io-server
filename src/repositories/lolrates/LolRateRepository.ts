import { Not } from "typeorm"
import { dataSource } from "../../dataSource"
import { LolRateDto } from "../../dtos/lolrates/LolRateDto"
import { WinratesUpdatedAtDTO } from "../../dtos/lolrates/WinratesUpdatedAtDTO"
import { Champion } from "../../entities/LolRates/Champion"
import { LolRate } from "../../entities/LolRates/LolRate"
import { RoleTypes } from "../../types/domain/lolates/RoleTypes"
import { AramChampionData } from "../../utils/lolrates/scrapeLolRates/scrapeAram"
import { IChampion } from "../../utils/lolrates/scrapeLolRates/scrapeChampions"
import { IOpggResult as ScrapeResult } from "../../utils/lolrates/scrapeLolRates/scrapeOpgg"
import { myConsoleError } from "../../utils/myConsoleError"
import { myConsoleSuccess } from "../../utils/myConsoleSuccess"
import myRedis from "../../utils/redis/myRedis"

const LolRateRepository = dataSource.getRepository(LolRate).extend({
  async findWinrates(): Promise<LolRateDto[]> {
    try {
      const cached = await myRedis
        .get("winrates")
        .catch((err) => myConsoleError(err.message))

      if (cached) {
        myConsoleSuccess('CACHE HIT: "winrates"')
        return JSON.parse(cached)
      }

      const winrates = await this.query(`
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
              (COALESCE("opggPick", 0) + COALESCE("lolgraphsPick", 0) + COALESCE("uggPick", 0))/3 as "avgPick",
              (COALESCE("opggWin", 0)   + COALESCE ("lolgraphsWin", 0)  + COALESCE("uggWin", 0))/3 as "avgWin"
         from "lol_rate") as avgs
where  "avgWin" > 0
order by "avgAvg" desc 
        `)

      await myRedis.set("winrates", JSON.stringify(winrates), "EX", 3600)

      return winrates
    } catch (e) {
      myConsoleError(e.message)
      throw e
    }
  },

  async findWinratesPaginated() {
    try {
      return this.createQueryBuilder()
        .select("lolRates")
        .from(LolRate, "lolRates")
    } catch (err) {}
  },

  async getUpdatedAt(): Promise<WinratesUpdatedAtDTO> {
    return this.query(`
            select "opggUpdatedAt",
                   "lolgraphsUpdatedAt",
                   "uggUpdatedAt"
              from "lol_rate"
             limit 1
        `)
  },

  async saveChampions(champions: IChampion[]) {
    try {
      // Saving on LolRate table
      for (const champion of champions) {
        const { name: championName, iconUrl } = champion

        const roles: RoleTypes[] = ["TOP", "JUNGLE", "MID", "BOT", "SUP"]
        for (const role of roles) {
          const exists = await this.findOne({
            where: { championName, role },
          })

          if (!exists) {
            const id = await this.getNextId()
            const lolRateRepo = dataSource.getRepository(LolRate)

            await lolRateRepo.query(
              `
            INSERT INTO "lol_rate" ("id","championName", "iconUrl", "role") 
              values($1,$2, $3, $4)
            `,
              [id, championName, iconUrl, role]
            )
          }
        }
      }

      // Saving on Champion table
      const championRepo = dataSource.getRepository(Champion)
      for (const { name, iconUrl } of champions) {
        const exists = await championRepo.findOne({
          where: { name },
        })

        if (!exists) {
          const [last] = await championRepo.find({
            order: {
              id: "DESC",
            },
          })

          const nextId = last ? last.id + 1 : 1

          await championRepo.query(
            `
          INSERT INTO "champion" ("id", "name", "iconUrl")
            values($1, $2, $3)
          `,
            [nextId, name, iconUrl]
          )
        }
      }

      return this.find()
    } catch (err) {
      myConsoleError(err.message)
    }
  },

  async getNextId() {
    const last = await this.findOne({
      where: {
        championName: Not(""),
      },
      order: { id: "DESC" },
    })
    if (!last) {
      return 1
    }

    return last.id + 1
  },

  async saveOpgg(results: ScrapeResult[]) {
    try {
      // resetting all from op.gg
      await this.createQueryBuilder()
        .update()
        .set({
          opggPick: 0,
          opggWin: 0,
          opggAvg: 0,
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
  },
  async saveAramScrapedChampion(results: AramChampionData[]) {
    try {
      // resetting all from aram
      await this.createQueryBuilder()
        .update()
        .set({
          aramWin: 0,
          aramUpdatedAt: new Date().toISOString(),
        })
        .execute()

      for (const { championName, winRate } of results) {
        const aramWin = Number(winRate.trim().replace(/%/g, ""))

        await this.createQueryBuilder()
          .update()
          .set({
            aramWin,
            aramUpdatedAt: new Date().toISOString(),
          })
          .where("championName = :championName", { championName })
          .execute()
      }
    } catch (err) {
      myConsoleError(err.message)
    }
  },

  async saveLolGraphs(results: ScrapeResult[]) {
    try {
      // resetting all from op.gg
      await this.createQueryBuilder()
        .update()
        .set({
          lolgraphsPick: 0,
          lolgraphsWin: 0,
          lolgraphsAvg: 0,
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
  },

  async saveUgg(results: ScrapeResult[]) {
    try {
      // resetting all from op.gg
      await this.createQueryBuilder()
        .update()
        .set({
          uggPick: 0,
          uggWin: 0,
          uggAvg: 0,
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
  },
})

export default LolRateRepository
