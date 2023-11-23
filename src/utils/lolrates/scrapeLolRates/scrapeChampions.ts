import axios from "axios"
import { JSDOM } from "jsdom"
import { Page } from "puppeteer"
import LolRateRepository from "../../../repositories/lolrates/LolRateRepository"
import { myConsoleError } from "../../myConsoleError"

export interface IChampion {
  name: string
  iconUrl: string
}

export async function scrapeChampions(page: Page) {
  try {
    // u.gg
    const html = await axios
      .get<string>("https://u.gg/lol/champions")
      .then((res) => res.data)

    const dom = new JSDOM(html)
    const document = dom.window.document

    const champions: IChampion[] = []

    const championsLinks = Array.from(
      document.querySelectorAll(".champion-link")
    )

    for (const championLink of championsLinks) {
      const name = championLink.querySelector(".champion-name")?.textContent
      const iconUrl = championLink.querySelector("img")?.getAttribute("src")

      if (name && iconUrl) {
        champions.push({ name, iconUrl })
      }
    }

    const saved = await LolRateRepository.saveChampions(champions)

    return saved
  } catch (err) {
    myConsoleError(err.message)
  }
}
