import axios from "axios"
import { JSDOM } from "jsdom"
import { Page } from "puppeteer"
import { IsNull } from "typeorm"
import { dataSource } from "../../../dataSource"
import { MalRepository } from "../../../domains/lolrates/mal/MalRepository"
import { MalUser } from "../../../entities/MAL/MalUser"
import { MalUserSimilarity } from "../../../entities/MAL/MalUserSimilarity"
import { myConsoleError } from "../../myConsoleError"
import { myConsoleSuccess } from "../../myConsoleSuccess"
import { sleep } from "../../sleep"
import urls from "../../urls"
import { scrapeMalUserFriends } from "./scrapeMalUserFriends/scrapeMalUserFriends"

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

    const uncheckedUsers = await dataSource
      .getRepository(MalUserSimilarity)
      .find({
        where: {
          usernameA: malUser.username,
          lastScraped: IsNull(),
          lastErrorAt: "",
        },
      })

    if (uncheckedUsers.length === 0) {
      scrapeMalUserFriends({
        malUserA: malUser,
        usernameB: malUser.username,
        cookiesStr: cookiesStr,
      })
      return
    }

    for (const uncheckedUser of uncheckedUsers) {
      try {
        const html = await axios
          .get<string>(urls.malProfile(uncheckedUser.usernameB), {
            headers: {
              cookie: cookies.map((c) => `${c.name}=${c.value}`).join(";"),
            },
          })
          .then((res) => res.data)

        const jsdom = new JSDOM(html)
        const document = jsdom.window.document

        const titlesSpans = document.querySelectorAll(".user-status-title")

        const genderSpan = Array.from(titlesSpans).find((span) =>
          span.textContent.includes("Gender")
        )

        const birthdaySpan = Array.from(titlesSpans).find((span) =>
          span.textContent.includes("Birthday")
        )

        const locationSpan = Array.from(titlesSpans).find((span) =>
          span.textContent.includes("Location")
        )

        const compatibilitySpans = document.querySelectorAll(
          ".user-compatability-data"
        )

        const animeCount = parseInt(compatibilitySpans[0].textContent)
        const mangaCount = parseInt(compatibilitySpans[1].textContent)

        const animeSimilarity = parseFloat(
          document
            .querySelector(".bar-outer.anime")
            ?.querySelector(".bar-outer-positive")?.textContent || "0"
        )
        const mangaSimilarity = parseFloat(
          document
            .querySelector(".bar-outer.manga")
            ?.querySelector(".bar-outer-positive")?.textContent || "0"
        )

        const img = document.querySelector(".user-image")?.querySelector("img")

        const lastOnlineSpan = Array.from(titlesSpans).find((span) =>
          span.textContent.includes("Last Online")
        )

        const infos = {
          gender: genderSpan?.nextElementSibling?.textContent || "",
          birthday: birthdaySpan?.nextElementSibling?.textContent || "",
          location: locationSpan?.nextElementSibling?.textContent || "",
          animeCount,
          mangaCount,
          animeSimilarity,
          mangaSimilarity,
          //img data-src
          img: img?.dataset?.src || "",
          lastOnline: lastOnlineSpan?.nextElementSibling?.textContent || "",
        }

        // go to friends

        scrapeMalUserFriends({
          malUserA: malUser,
          cookiesStr: cookiesStr,
          usernameB: uncheckedUser.usernameB,
        })

        await dataSource
          .getRepository(MalUserSimilarity)
          .update(uncheckedUser.id, {
            gender: infos.gender,
            birthday: infos.birthday,
            location: infos.location,
            animeCount: infos.animeCount,
            mangaCount: infos.mangaCount,
            animePercentage: infos.animeSimilarity,
            mangaPercentage: infos.mangaSimilarity,
            lastScraped: new Date().toISOString(),
            lastOnlineAt: infos.lastOnline,
            imageUrl: infos.img,
          })

        myConsoleSuccess(`Finished scraping ${uncheckedUser.usernameB}`)
      } catch (e) {
        await repo.updateErrorMalSimilarity(uncheckedUser.id)
        myConsoleError(`Error scraping ${uncheckedUser.usernameB}`)
        continue
      }
    }

    // for each
  } catch (err) {
    myConsoleError(err.message)
  }
}
