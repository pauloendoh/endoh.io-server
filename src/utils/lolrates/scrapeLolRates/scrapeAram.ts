import { Page } from "puppeteer"
import LolRateRepository from "../../../repositories/lolrates/LolRateRepository"
import { myConsoleError } from "../../myConsoleError"
import { myConsoleSuccess } from "../../myConsoleSuccess"
import { sleep } from "../../sleep"

export type AramChampionData = {
  championName: string
  winRate: string
}

export async function scrapeAram(page: Page) {
  myConsoleSuccess("[START] scrapeAram")
  try {
    let aramResults: AramChampionData[] = []

    await page.goto(`https://www.op.gg/modes/aram`, {
      waitUntil: "load",
      timeout: 0,
    })

    await page.waitForSelector("tbody")
    await sleep(500) // waiting for champions sort

    aramResults = aramResults.concat(
      await page.evaluate(() => {
        const roleResults: AramChampionData[] = []
        const tbody = document.querySelector("tbody")
        const trs = Array.from(tbody?.querySelectorAll("tr") || [])

        for (const tr of trs) {
          const tds = tr.querySelectorAll("td")
          const championTd = tds[1]
          const championName =
            championTd?.querySelector("strong")?.textContent ?? ""
          const winRate = tds[3].innerText

          roleResults.push({
            championName,
            winRate,
          })
        }

        return roleResults
      })
    )

    const saved = await LolRateRepository.saveAramScrapedChampion(aramResults)
    myConsoleSuccess(`[END] scrapeAram: ${aramResults.length} results`)

    return
  } catch (err) {
    myConsoleError(`[ERROR] scrapeAram: ${err.message}`)
  }
}
