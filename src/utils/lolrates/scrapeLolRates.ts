import { config } from "dotenv"
import pup from "puppeteer"
import { myConsoleError } from "../myConsoleError"
import { myEnvs } from "../myEnvs"
import { cacheCallback } from "../redis/cacheCallback"
import myRedis from "../redis/myRedis"
import { redisKeys } from "../redis/redisKeys"
import { scrapeAram } from "./scrapeLolRates/scrapeAram"
import { scrapeChampions } from "./scrapeLolRates/scrapeChampions"
import { scrapeLolGraphs } from "./scrapeLolRates/scrapeLolGraphs"
import { scrapeOpgg } from "./scrapeLolRates/scrapeOpgg"
import { scrapeUgg } from "./scrapeLolRates/scrapeUgg"
config()

export async function scrapeLolRates() {
  const alreadyScrapedToday = await myRedis.get(redisKeys.scrapedLolRates)
  if (alreadyScrapedToday) {
    myConsoleError("Already scraped lol rates today, skipping...")
    return
  }

  try {
    if (myEnvs.IS_DOCKER) {
      return
    }
    const browser = await pup.launch({
      // devtools: true, // if you want to debug https://stackoverflow.com/a/49887254/8060650
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    try {
      const page = await browser.newPage()

      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
      )
      await page.setViewport({ width: 1000, height: 1000 })

      await cacheCallback(
        redisKeys.scrapedChampionsAt,
        async () => {
          await scrapeChampions(page)
          return new Date().toISOString()
        },
        60 * 60 * 24
      )

      await cacheCallback(
        redisKeys.scrapedAramAt,
        async () => {
          await scrapeAram(page)
          return new Date().toISOString()
        },
        60 * 60 * 24
      )

      await cacheCallback(
        redisKeys.scrapedOpggAt,
        async () => {
          await scrapeOpgg(page)
          return new Date().toISOString()
        },
        60 * 60 * 24
      )

      await cacheCallback(
        redisKeys.scrapedLolGraphsAt,
        async () => {
          await scrapeLolGraphs(page)
          return new Date().toISOString()
        },
        60 * 60 * 24
      )

      await cacheCallback(
        redisKeys.scrapedUggAt,
        async () => {
          await scrapeUgg(page)
          return new Date().toISOString()
        },
        60 * 60 * 24
      )

      await myRedis.set(redisKeys.scrapedLolRates, "true", "EX", 60 * 60 * 24)
    } catch (err) {
      myConsoleError(err.message)
    }

    await browser.close()
  } catch (err) {
    myConsoleError(err.message)
  }
}
