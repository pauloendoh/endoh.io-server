import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { UserProfileDto } from '../dtos/feed/UserProfileDto';
import { LolRate } from '../entities/LolRate';
import { User } from '../entities/User';
import { LolRoles } from '../utils/lolrates/lolRoles';
import { IChampion } from '../utils/lolrates/scrapeLolRates/scrapeChampions';
import { IOpggResult as ScrapeResult } from '../utils/lolrates/scrapeLolRates/scrapeOpgg';
import { myConsoleError } from '../utils/myConsoleError';

@EntityRepository(LolRate)
export default class LolRateRepository extends Repository<LolRate>{

    async saveChampions(champions: IChampion[]) {
        try {

            for (const champion of champions) {
                const { name: championName, iconUrl } = champion

                const exists = await this.findOne({
                    where: { championName, iconUrl }
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
                    opggUpdatedAt: new Date().toISOString()
                })
                .execute()

            for (const { role, championName, pickRate, winRate } of results) {
                const opggPick = Number(pickRate.trim().replace(/%/g, ''))
                const opggWin = Number(winRate.trim().replace(/%/g, ''))
                const opggAvg = Number((opggPick + opggWin) / 2)

                await this.createQueryBuilder()
                    .update()
                    .set({
                        opggPick,
                        opggWin,
                        opggAvg,
                        opggUpdatedAt: new Date().toISOString()
                    })
                    .where("championName = :championName", { championName })
                    .andWhere("role = :role", { role }).execute()
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
                    lolgraphsUpdatedAt: new Date().toISOString()
                })
                .execute()

            for (const { role, championName, pickRate, winRate } of results) {
                const lolgraphsPick = Number(pickRate.trim().replace(/%/g, ''))
                const lolgraphsWin = Number(winRate.trim().replace(/%/g, ''))
                const lolgraphsAvg = Number((lolgraphsPick + lolgraphsWin) / 2)

                await this.createQueryBuilder()
                    .update()
                    .set({
                        lolgraphsPick,
                        lolgraphsWin,
                        lolgraphsAvg,
                        lolgraphsUpdatedAt: new Date().toISOString()
                    })
                    .where("championName = :championName", { championName })
                    .andWhere("role = :role", { role }).execute()
            }
        } catch (err) {
            myConsoleError(err.message)
        }
    }
}