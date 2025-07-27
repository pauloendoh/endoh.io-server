import { RouterImplementation } from "@ts-rest/express/src/lib/types"
import axios from "axios"
import { BadRequestError } from "routing-controllers"
import myRedis from "../../utils/redis/myRedis"
import { redisKeys } from "../../utils/redis/redisKeys"
import { myJSDOMDocument } from "../../utils/runMyJSDOM"
import { $ScrapeWeatherForecast } from "./use-cases/$ScrapeWeatherForecast"
import { weatherContract } from "./weather.contract"

const $scrapeWeatherForecast = new $ScrapeWeatherForecast()
const redis = myRedis

export const weatherController: RouterImplementation<typeof weatherContract> = {
  getWeatherForecast: {
    handler: async ({ req }) => {
      if (!req.query.lat || !req.query.lon) {
        throw new BadRequestError("Missing lat or lon")
      }
      const cached = await redis.get(redisKeys.weatherForecast(req.query))

      if (cached) {
        return JSON.parse(cached)
      }

      const html = await axios
        .get<string>(
          `https://weather.com/weather/today/l/${req.query.lat},${req.query.lon}`,
          {
            headers: {
              "twc-unit": "m",
            },
          }
        )
        .then((res) => res.data)
        .catch((err) => {
          console.log("Error fetching weather forecast")
          throw err
        })

      const document = myJSDOMDocument(html)
      if (!document) {
        throw new Error("Error parsing html")
      }

      const forecastHref = document
        .querySelector('[data-testid="TodayWeatherModule"]')
        ?.querySelector('[data-testid="CardFooter"]')
        ?.querySelector("a")
        ?.getAttribute("href")

      if (!forecastHref) {
        throw new Error("Could not find forecast href")
      }

      const result = await $scrapeWeatherForecast.exec(
        `https://weather.com${forecastHref}`
      )

      await redis.set(
        redisKeys.weatherForecast(req.query),
        JSON.stringify(result),
        "EX",
        60 * 5 // 5 min
      )

      return {
        status: 200,
        body: result,
      }
    },
  },
}
