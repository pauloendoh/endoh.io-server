import * as pup from "puppeteer"
import { myConsoleError } from "../myConsoleError"
import { scrapeChampions } from "./scrapeLolRates/scrapeChampions"
import { scrapeOpgg } from "./scrapeLolRates/scrapeOpgg"
import { scrapeLolGraphs } from "./scrapeLolRates/scrapeLolGraphs"

export async function scrapeLolRates() {
  const browser = await pup.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  try {
    const page = await browser.newPage()

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
    )

    await scrapeChampions(page)
    await scrapeOpgg(page)
    await scrapeLolGraphs(page)
  } catch (err) {
    await browser.close()
    myConsoleError(err.message)
  }
}
