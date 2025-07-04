import { Page } from "puppeteer"
import LolRateRepository from "../../../repositories/lolrates/LolRateRepository"
import { RoleTypes } from "../../../types/domain/lolates/RoleTypes"
import { myConsoleError } from "../../myConsoleError"
import { myConsoleSuccess } from "../../myConsoleSuccess"
import { IOpggResult } from "./scrapeOpgg"

export async function scrapeLolGraphs(page: Page) {
  try {
    myConsoleSuccess("Starting scrapeLolGraphs")

    await page.goto("http://www.leagueofgraphs.com/champions/builds/by-winrate")

    await page.waitForSelector("td.tier")

    const results = await page.evaluate(async () => {
      function sleep(millis: number) {
        return new Promise(function (resolve) {
          setTimeout(resolve, millis)
        })
      }

      const roles: { href: string; role: RoleTypes }[] = [
        {
          href: "/champions/tier-list/top ",
          role: "TOP",
        },
        {
          href: "/champions/tier-list/jungle ",
          role: "JUNGLE",
        },
        {
          href: "/champions/tier-list/middle ",
          role: "MID",
        },
        {
          href: "/champions/tier-list/adc ",
          role: "BOT",
        },
        {
          href: "/champions/tier-list/support ",
          role: "SUP",
        },
      ]

      const results: IOpggResult[] = []

      for (const { href, role } of roles) {
        const defaultAnchor = document.querySelector(
          'a[href="/champions/tier-list "]'
        ) as HTMLAnchorElement | null

        if (!defaultAnchor) {
          continue
        }
        defaultAnchor.click()
        await sleep(1000)

        const roleAnchor = document.querySelector(
          `a[href="${href}"]`
        ) as HTMLAnchorElement | null
        if (!roleAnchor) {
          continue
        }

        roleAnchor.click()
        await sleep(1000)

        const trs = Array.from(document.querySelectorAll("td .tier"))
          .map((td) => td.closest("tr"))
          .filter((tr) => !!tr)

        for (const tr of trs) {
          const championName =
            tr?.querySelector("span.name")?.textContent?.trim() || ""

          const progressBarTexts = Array.from(
            tr?.querySelectorAll("td .progressBarTxt") || []
          ) // eg: ["12.5%", "50.3%"]

          // index 0 is pick rate, index 1 is win rate
          const pickRate = progressBarTexts[0]?.textContent?.trim()

          const winRate = progressBarTexts[1]?.textContent?.trim()

          if (championName && pickRate && winRate) {
            results.push({ role, championName, pickRate, winRate })
          }
        }
      }

      return results
    })

    await LolRateRepository.saveLolGraphs(results)

    myConsoleSuccess("Finished scrapeLolGraphs")
  } catch (err) {
    myConsoleError(err.message)
  }
}
