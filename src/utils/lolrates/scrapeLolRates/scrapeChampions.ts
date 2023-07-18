import { Page } from "puppeteer"
import { myConsoleError } from "../../myConsoleError"

export interface IChampion {
  name: string
  iconUrl: string
}

export async function scrapeChampions(page: Page) {
  try {
    await page.goto("https://blitz.gg/lol/champions/overview")

    await page.waitForSelector(".infinite-table")

    // scroll to end of page at least 5 times
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight)
      })
      // 1 second
      await page.waitForTimeout(1000)
    }

    const champions = await page.evaluate(() => {
      const champions: IChampion[] = []

      const table = document.querySelector(".infinite-table")

      const divsParent = table?.querySelector("div[style='flex: 1 1 0%;']")

      let championDivs = divsParent?.children || []

      for (const div of Array.from(championDivs)) {
        if (!div.className.includes("⚡")) continue
        console.log({
          div,
        })
        const championDiv = div.children[3]

        const img = championDiv.querySelector("img")
        if (!img) continue
        const iconUrl = img.getAttribute("src") || ""
        const name = championDiv?.querySelector("span")?.textContent || ""

        // 23/apr 2022 - it was returning fallback images
        // like https://blitz-cdn-plain.blitz.gg/blitz/ui/img/fallback.svg
        // and it was causing repeated champions
        if (iconUrl.includes("fallback")) continue

        champions.push({ name, iconUrl })
      }

      return champions
    })

    // const saved = await LolRateRepository.saveChampions(champions)

    // return saved
  } catch (err) {
    myConsoleError(err.message)
  }
}
