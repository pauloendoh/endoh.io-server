import * as pup from "puppeteer"
import { getCustomRepository } from "typeorm"
import LolRateRepository from "../../../repositories/lolrates/LolRateRepository"
import { myConsoleError } from "../../myConsoleError"
import { RoleTypes } from "../../../types/domain/lolates/RoleTypes"

export interface IOpggResult {
  role: string
  championName: string
  winRate: string
  pickRate: string
}

export async function scrapeOpgg(page: pup.Page) {
  try {
    await page.goto("https://www.op.gg/champion/statistics")

    await page.waitForSelector(
      '[data-tab-show-class="champion-trend-winratio"]'
    )

    const results = await page.evaluate(() => {
      function getRoleByTBodyIndex(index: number): RoleTypes {
        switch (index) {
          case 0:
            return "TOP"
          case 1:
            return "JUNGLE"
          case 2:
            return "MID"
          case 3:
            return "BOT"
          case 4:
            return "SUP"
        }
      }

      const results: IOpggResult[] = []

      const tbodies = Array.from(document.querySelectorAll("tbody"))
      let tbodyIndex = 0
      for (const tbody of tbodies) {
        const trs = Array.from(tbody.querySelectorAll("tr"))

        for (const tr of trs) {
          const tds = tr.querySelectorAll("td")
          const championTd = tds[3]
          const championName = championTd.querySelector(
            ".champion-index-table__name"
          ).textContent
          const winRate = tds[4].innerText
          const pickRate = tds[5].innerText

          results.push({
            role: getRoleByTBodyIndex(tbodyIndex),
            championName,
            winRate,
            pickRate,
          })
        }
        tbodyIndex++
      }
      return results
    })

    const saved = await getCustomRepository(LolRateRepository).saveOpgg(results)

    return
  } catch (err) {
    myConsoleError(err.message)
  }
}
