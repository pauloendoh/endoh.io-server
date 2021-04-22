import { Repository } from 'typeorm';
import { LolRate } from '../entities/LolRate';
import { IChampion } from '../utils/lolrates/scrapeLolRates/scrapeChampions';
import { IOpggResult as ScrapeResult } from '../utils/lolrates/scrapeLolRates/scrapeOpgg';
export default class LolRateRepository extends Repository<LolRate> {
    saveChampions(champions: IChampion[]): Promise<LolRate[]>;
    saveOpgg(results: ScrapeResult[]): Promise<void>;
    saveLolGraphs(results: ScrapeResult[]): Promise<void>;
}
