import { config } from "dotenv"
import pup from "puppeteer"
import { myConsoleError } from "../myConsoleError"
import { scrapeMalUser } from "./scrapeMalUser/scrapeMalUser"
config()

export async function scrapeMal() {
  if (process.env.IS_DOCKER) {
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

    await scrapeMalUser(page)
  } catch (err) {
    myConsoleError(err.message)
  }

  await browser.close()
}
