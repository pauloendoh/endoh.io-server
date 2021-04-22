import * as pup from 'puppeteer'
import { getCustomRepository } from 'typeorm'
import LolRateRepository from '../../../repositories/LolRateRepository'
import { myConsoleError } from '../../myConsoleError'

export interface IChampion {
    name: string,
    iconUrl: string
}

export async function scrapeChampions() {
    try {
        const browser = await pup.launch({ args: ['--no-sandbox'] })
        const page = await browser.newPage()

        await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36")

        await page.goto('https://blitz.gg/lol/champions/overview')

        await page.waitForSelector('.champion-name-container')

        const champions = await page.evaluate(() => {

            const champions: IChampion[] = []
            const containers = Array.from(document.querySelectorAll('.champion-name-container'))

            for (const container of containers) {
                const iconUrl = container.querySelector('img').getAttribute('src')
                const name = container.querySelector('span').textContent
                champions.push({ name, iconUrl })
            }

            return champions
        })

        const saved = await getCustomRepository(LolRateRepository)
            .saveChampions(champions)

        await browser.close();
        return saved

    } catch (err) {
        myConsoleError(err.message)
    }

}