import axios from "axios"
import { JSDOM } from "jsdom"
import { dataSource } from "../../../../dataSource"
import { MalUser } from "../../../../entities/MAL/MalUser"
import { MalUserSimilarity } from "../../../../entities/MAL/MalUserSimilarity"
import { myConsoleSuccess } from "../../../myConsoleSuccess"
import urls from "../../../urls"

export const scrapeMalUserFriends = async (params: {
  malUserA: MalUser
  usernameB: string
  cookiesStr: string
}) => {
  const { malUserA, usernameB } = params

  const html = await axios
    .get(urls.malFriends(usernameB), {
      headers: {
        cookie: params.cookiesStr,
      },
    })
    .then((res) => res.data)

  const jsdom = new JSDOM(html)

  const document = jsdom.window.document

  const usernames: string[] = []
  const boxlists = document.querySelectorAll(".boxlist")
  boxlists.forEach((boxlist) => {
    const username = boxlist.querySelector(".title")?.textContent
    if (username) {
      usernames.push(username)
    }
  })

  // use transaction
  await dataSource.transaction(async (transactionalEntityManager) => {
    for (const username of usernames) {
      if (username === malUserA.username) {
        continue
      }

      const alreadyExists = await transactionalEntityManager
        .getRepository(MalUserSimilarity)
        .findOne({
          where: {
            usernameA: malUserA.username,
            usernameB: username,
          },
        })
      if (alreadyExists) {
        continue
      }

      const malUserSimilarity = transactionalEntityManager
        .getRepository(MalUserSimilarity)
        .create({
          usernameA: malUserA.username,
          usernameB: username,
        })
      transactionalEntityManager
        .getRepository(MalUserSimilarity)
        .save(malUserSimilarity)
    }
  })

  await dataSource.getRepository(MalUserSimilarity).update(
    {
      usernameA: malUserA.username,
      usernameB: usernameB,
    },
    {
      friendsScrapedAt: new Date().toISOString(),
    }
  )

  myConsoleSuccess("Finished scrapeMalUserFriends for " + usernameB)
}
