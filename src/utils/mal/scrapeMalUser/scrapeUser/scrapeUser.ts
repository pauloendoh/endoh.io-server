import { JSDOM } from "jsdom"

import axios from "axios"
import { dataSource } from "../../../../dataSource"
import { MalRepository } from "../../../../domains/lolrates/mal/MalRepository"
import { MalUser } from "../../../../entities/MAL/MalUser"
import { MalUserSimilarity } from "../../../../entities/MAL/MalUserSimilarity"
import { myConsoleError } from "../../../myConsoleError"
import { myConsoleSuccess } from "../../../myConsoleSuccess"
import urls from "../../../urls"
import { scrapeMalUserFriends } from "../scrapeMalUserFriends/scrapeMalUserFriends"

export const scrapeUser = async (params: {
  userToScrape: MalUserSimilarity
  malUser: MalUser
  cookiesStr: string
  repo: MalRepository
}) => {
  const { userToScrape, malUser } = params
  try {
    const html = await axios
      .get<string>(urls.malProfile(userToScrape.usernameB), {
        headers: {
          cookie: params.cookiesStr,
        },
      })
      .then((res) => res.data)
      .catch((e) => {
        throw e
      })

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
      cookiesStr: params.cookiesStr,
      usernameB: userToScrape.usernameB,
    }).catch((e) => {
      myConsoleError(`Error scraping ${userToScrape.usernameB} friends`)
    })

    await dataSource.getRepository(MalUserSimilarity).update(userToScrape.id, {
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

    myConsoleSuccess(`Finished scraping ${userToScrape.usernameB}`)
  } catch (e) {
    await params.repo.updateErrorMalSimilarity(userToScrape.id)
    myConsoleError(`Error scraping ${userToScrape.usernameB}: ${e.message}`)
  }
}
