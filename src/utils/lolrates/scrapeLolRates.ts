import { myConsoleError } from '../myConsoleError'
import { scrapeChampions } from './scrapeLolRates/scrapeChampions'
import { scrapeOpgg } from './scrapeLolRates/scrapeOpgg'
import { scrapeLolGraphs } from './scrapeLolRates/scrapeLolGraphs'


export async function scrapeLolRates() {
    try {
        // await scrapeChampions()
        await scrapeOpgg()
        await scrapeLolGraphs()


    } catch (err) {
        myConsoleError(err.message)
    }

}