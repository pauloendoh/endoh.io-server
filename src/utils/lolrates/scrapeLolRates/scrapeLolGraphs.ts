import * as pup from 'puppeteer'
import { getCustomRepository } from 'typeorm'
import LolRateRepository from '../../../repositories/LolRateRepository'
import { myConsoleError } from '../../myConsoleError'
import { myConsoleSuccess } from '../../myConsoleSuccess'
import { LolRoles } from '../lolRoles'
import { IOpggResult } from './scrapeOpgg'


export async function scrapeLolGraphs() {
    try {
        myConsoleSuccess("Starting scrapeLolGraphs")
        const browser = await pup.launch({ ignoreDefaultArgs: true, })


        const page = await browser.newPage()
        await page.setViewport({
            width: 640,
            height: 480,
            deviceScaleFactor: 1,
        });

        await page.goto('http://www.leagueofgraphs.com/champions/builds/by-winrate')
        await page.screenshot({ path: __dirname + '/scrapeLolGraphs.png' });

        await page.waitForSelector('.data_table.with_sortable_column tbody')

        page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

        const results = await page.evaluate(async () => {

            function delay(time) {
                return new Promise(function (resolve) {
                    setTimeout(resolve, time)
                });
            }


            const roles: { dataFilterFixed: string, role: LolRoles }[] = [
                {
                    dataFilterFixed: "roles=top",
                    role: "TOP"
                },
                {
                    dataFilterFixed: "roles=jungle",
                    role: "JUNGLE"
                },
                {
                    dataFilterFixed: "roles=middle",
                    role: "MID"
                },
                {
                    dataFilterFixed: "roles=adc",
                    role: "BOT"
                },
                {
                    dataFilterFixed: "roles=support",
                    role: "SUP"
                }]


            const results: IOpggResult[] = []


            for (const { dataFilterFixed, role } of roles) {
                const roleButton = document.querySelector(`[data-filters-fixed="${dataFilterFixed}"]`) as HTMLElement

                roleButton.click()
                await delay(2000)

                console.log(1)
                const trs = document.querySelectorAll('.data_table.with_sortable_column tbody tr')
                for (const tr of trs) {
                    if (tr.textContent.includes('KDA') || !tr.querySelector('.name'))
                        continue;


                    const tds = tr.querySelectorAll('td')
                    console.log(2)
                    const championName = tds[1].querySelector('.name').textContent.trim()
                    console.log(3)
                    const pickRate = tds[2].querySelector('.progressBarTxt').textContent
                    console.log(4)
                    const winRate = tds[3].querySelector('.progressBarTxt').textContent

                    results.push({ role, championName, pickRate, winRate })
                }

            }




            return results
        })


        const saved = await getCustomRepository(LolRateRepository).saveLolGraphs(results)
        console.log(saved)
        myConsoleSuccess("Finished scrapeLolGraphs")
        await browser.close();

    } catch (err) {
        myConsoleError(err.message)
    }

}