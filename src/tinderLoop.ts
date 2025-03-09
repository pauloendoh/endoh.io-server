import { config } from "dotenv"
import pup from "puppeteer"
config()

import { notify } from "node-notifier"
import { dataSource } from "./dataSource"
import { myConsoleError } from "./utils/myConsoleError"
import { sleep } from "./utils/sleep"

dataSource.initialize().then(async () => {
  while (true) {
    await scrapeTinder().catch((e) => {
      notify("Error while scraping")
    })
  }
})

async function scrapeTinder() {
  const browser = await pup.launch({
    devtools: true, // if you want to debug https://stackoverflow.com/a/49887254/8060650
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  try {
    const page = await browser.newPage()

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
    )
    await page.setViewport({ width: 1000, height: 1000 })

    await page.goto("https://tinder.com/")

    let pageUrl = page.url()

    while (pageUrl !== "https://tinder.com/app/recs") {
      await sleep(1000)
      pageUrl = page.url()
    }

    while (true) {
      await sleep(1000)
      const like = await page.evaluate(async () => {
        const localSleep = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms))

        let divs = document.querySelectorAll("div")
        let noThanksDiv = Array.from(divs).find(
          (d) => d.innerText === "No Thanks"
        )
        if (noThanksDiv) {
          noThanksDiv.click()
          await localSleep(1000)
        }

        let spans = document.querySelectorAll("span")

        let infoSpan = Array.from(spans).find(
          (s) => s.innerText === "Open Profile"
        )

        if (!infoSpan) {
          return false
        }

        infoSpan.click()
        await localSleep(1000)

        let professions = [
          "software engineer",
          "programadora",
          "desenvolvedora",
          "developer",
          "design",
          "ux design",
          "de sistemas",
          "streamer",
        ]
        if (
          Array.from(divs).some((d) => {
            let text = d.innerText.toLowerCase()
            return professions.some((p) => text.includes(p))
          })
        ) {
          return true
        }

        let bannedWords = ["relacionamento aberto"]
        if (
          Array.from(divs).some((d) => {
            let text = d.innerText.toLowerCase()
            return bannedWords.some((p) => text.includes(p))
          })
        ) {
          return false
        }

        let h2s = document.querySelectorAll("h2")
        let passionsH2 = Array.from(h2s).find((s) => s.innerText === "Passions")

        if (!passionsH2) {
          return false
        }

        let passionsDiv = passionsH2.nextSibling
        let passionsText = passionsDiv?.textContent?.toLowerCase() || ""
        let validPassions = [
          "anime",
          "manga",
          "league of legends",
          "twitch",
          "e-sports",
          "online game",
        ]
        if (validPassions.some((p) => passionsText.includes(p))) {
          return true
        }

        return false
      })

      if (like) {
        await page.keyboard.press("ArrowRight")
        continue
      }

      await page.keyboard.press("ArrowLeft")
    }
  } catch (err) {
    myConsoleError(err.message)
  }

  await browser.close()
}
