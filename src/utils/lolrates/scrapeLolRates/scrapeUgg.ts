import * as pup from "puppeteer"
import { getCustomRepository } from "typeorm"
import LolRateRepository from "../../../repositories/LolRateRepository"
import { myConsoleError } from "../../myConsoleError"
import { myConsoleSuccess } from "../../myConsoleSuccess"
import { LolRoles } from "../lolRoles"
import { IOpggResult } from "./scrapeOpgg"

const roles: { url: string; role: LolRoles }[] = [
  {
    url: "https://u.gg/lol/top-lane-tier-list",
    role: "TOP",
  },
  {
    url: "https://u.gg/lol/jungle-tier-list",
    role: "JUNGLE",
  },
  {
    url: "https://u.gg/lol/mid-lane-tier-list",
    role: "MID",
  },
  {
    url: "https://u.gg/lol/adc-tier-list",
    role: "BOT",
  },
  {
    url: "https://u.gg/lol/support-tier-list",
    role: "SUP",
  },
]

export async function scrapeUgg(page: pup.Page) {
  try {
    myConsoleSuccess("Starting scrapeUgg")

    const results: IOpggResult[] = []
    for (const { url, role } of roles) {
      await page.goto(url)
      await page.waitForSelector(".content-section")
      await page.waitForSelector(".pickrate")

      await page.screenshot({ path: __dirname + "/scrapeUgg.png" })

      const roleResults = await page.evaluate(async (role) => {
        const objects: IOpggResult[] = []

        function delay(time) {
          return new Promise(function (resolve) {
            setTimeout(resolve, time)
          })
        }

        // scrolling all the virtualized list
        let i = 0
        let interval = setInterval(() => {
          window.scrollTo(
            0,
            document.body.scrollHeight || document.documentElement.scrollHeight
          )
          i++
          if (i === 5) clearInterval(interval)
        }, 100)

        await delay(2000)

        const trs = Array.from(document.querySelectorAll(".rt-tr-group"))
        for (const tr of trs) {
          objects.push({
            championName: tr.querySelector(".champion-name").textContent,
            winRate: tr.querySelector(".winrate").textContent,
            pickRate: tr.querySelector(".pickrate").textContent,
            role,
          })
        }

        // console.log(trs)
        return objects
      }, role)

      results.push(...roleResults)
    }

    await getCustomRepository(LolRateRepository).saveUgg(results)
    console.log(results)

    myConsoleSuccess("Finished scrapeUgg")
  } catch (err) {
    myConsoleError(err.message)
  }
}
