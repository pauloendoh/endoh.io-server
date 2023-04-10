import { Page } from "puppeteer"
import { IsNull } from "typeorm"
import { dataSource } from "../../../dataSource"
import { MalRepository } from "../../../domains/lolrates/mal/MalRepository"
import { MalUser } from "../../../entities/MAL/MalUser"
import { MalUserSimilarity } from "../../../entities/MAL/MalUserSimilarity"
import { myConsoleError } from "../../myConsoleError"
import { myConsoleSuccess } from "../../myConsoleSuccess"
import { sleep } from "../../sleep"
import { scrapeUser } from "./scrapeUser/scrapeUser"

export type AramChampionData = {
  championName: string
  winRate: string
}

export async function scrapeMalUser(page: Page) {
  myConsoleSuccess("Starting scrapeMalUser")
  const malUsers = await dataSource.getRepository(MalUser).find()
  const malUser = malUsers[0]
  if (!malUser) {
    return
  }

  const repo = new MalRepository()

  try {
    await page.goto(`https://myanimelist.net/login.php?from=%2F`)

    await page.waitForSelector("#loginUserName")
    await sleep(500) // waiting for champions sort

    await page.type("#loginUserName", malUser.username)
    await page.type("#login-password", malUser.password)

    await page.click("input[type=submit]")

    await page.waitForSelector(".header-profile-link")

    const cookies = await page.cookies()
    const cookiesStr = cookies.map((c) => `${c.name}=${c.value}`).join(";")

    const usersToScrape = await dataSource
      .getRepository(MalUserSimilarity)
      .find({
        where: {
          usernameA: malUser.username,
          lastScraped: IsNull(),
          lastErrorAt: "",
        },
      })

    // if (usersToScrape.length === 0) {
    //   scrapeMalUserFriends({
    //     malUserA: malUser,
    //     usernameB: malUser.username,
    //     cookiesStr: cookiesStr,
    //   })
    //   return
    // }

    // parallel for loop with max of N at a time
    const N = 10
    let i = 0
    while (i < usersToScrape.length) {
      const promises = []
      for (let j = 0; j < N; j++) {
        if (i + j >= usersToScrape.length) {
          break
        }
        promises.push(
          scrapeUser({
            malUser,
            cookiesStr,
            userToScrape: usersToScrape[i + j],
            repo,
          })
        )
      }
      await Promise.all(promises)
      i += N
    }

    myConsoleSuccess("Finished scrapeMalUser")
  } catch (err) {
    myConsoleError(err)
  }
}
