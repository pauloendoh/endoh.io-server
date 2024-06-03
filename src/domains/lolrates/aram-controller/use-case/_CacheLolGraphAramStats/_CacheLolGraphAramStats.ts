import actualAxios from "axios"
import { myEnvs } from "../../../../../utils/myEnvs"
import pup from "../../../../../utils/puppeteer/pup"
import myRedis from "../../../../../utils/redis/myRedis"
import { redisKeys } from "../../../../../utils/redis/redisKeys"

type MyLolGraphAramStats = {
  championName: string
  played: number
  winRate: number
}

export class _CacheLolGraphAramStats {
  constructor(private redis = myRedis, private axios = actualAxios.create()) {}

  async exec(lolgraphsUrl: string): Promise<MyLolGraphAramStats[]> {
    const cached = await this.redis.get(redisKeys.lolgraphsUrl(lolgraphsUrl))
    if (cached) {
      return JSON.parse(cached)
    }

    if (myEnvs.IS_DOCKER) {
      return []
    }

    const browser = await pup.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    const page = await browser.newPage()
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
    )
    await page.setViewport({ width: 1000, height: 1000 })

    await page.goto(lolgraphsUrl, { waitUntil: "networkidle2" })

    const x = await page.evaluate(() => {
      const table = document.querySelector(".summoner_champions_details_table")
      const tbody = table?.querySelector("tbody")
      const trs = Array.from(tbody?.querySelectorAll("tr") || [])

      const champions: {
        championName: string
        played: number
        winRate: number
      }[] = []

      for (const tr of trs.slice(1)) {
        // skip first row
        const championName = (tr.querySelector(".name")?.textContent || "")
          .replace(/\n/g, "")
          .trim()
        const progressBarTxts = tr.querySelectorAll(".progressBarTxt")
        const played = Number(progressBarTxts?.[0]?.textContent)
        const winRate = Number(
          (progressBarTxts?.[1]?.textContent || "").replace("%", "")
        )

        champions.push({
          championName,
          played,
          winRate,
        })
      }
      console.log(table)
      return champions
    })

    await this.redis.set(
      redisKeys.lolgraphsUrl(lolgraphsUrl),
      JSON.stringify(x),
      "EX",
      60 * 60 * 24 // 1 day
    )

    return x

    //   let html = ""
    //   const cachedHtml = await this.redis.get(
    //     redisKeys.lolgraphsUrl(lolgraphsUrl)
    //   )
    //   if (cachedHtml) {
    //     html = cachedHtml
    //   } else {
    //     let data = await this.axios.get(lolgraphsUrl).catch((err) => {
    //       console.log(err)
    //       throw err
    //     })
    //     await this.redis.set(
    //       redisKeys.lolgraphsUrl(lolgraphsUrl),
    //       data.data,
    //       "EX",
    //       60 * 60 * 24 // 1 day
    //     )
    //   }
    //   const dom = new JSDOM(html).window.document
    //   const table = dom.querySelector(".summoner_champions_details_table")
    //   const tbody = table?.querySelector("tbody")
    //   const trs = Array.from(tbody?.querySelectorAll("tr") || [])
    //   for (const tr of trs) {
    //     const championName = tr.querySelector(".name")?.textContent
    //     const progressBarTxts = tr.querySelectorAll(".progressBarTxt")
    //     const played = progressBarTxts[0].textContent
    //     const winRate = progressBarTxts[1].textContent
    //     console.log(championName, played, winRate)
    //   }
    //   console.log(table)
  }
}
