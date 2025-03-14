import axios from "axios"
import { JSDOM } from "jsdom"
import {
  BadRequestError,
  Get,
  JsonController,
  QueryParams,
} from "routing-controllers"
import myRedis from "../../utils/redis/myRedis"
import { redisKeys } from "../../utils/redis/redisKeys"
import { $ScrapeWeatherForecast } from "./use-cases/$ScrapeWeatherForecast"

@JsonController()
export class WeatherController {
  constructor(
    private readonly $scrapeWeatherForecast = new $ScrapeWeatherForecast(),
    private readonly redis = myRedis
  ) {}

  @Get("/weather-forecast")
  async getWeatherForecast(@QueryParams() query: { lat: number; lon: number }) {
    if (!query.lat || !query.lon) {
      throw new BadRequestError("Missing lat or lon")
    }
    const cached = await this.redis.get(redisKeys.weatherForecast(query))

    if (cached) {
      return JSON.parse(cached)
    }

    const html = await axios
      .get<string>(
        `https://weather.com/weather/today/l/${query.lat},${query.lon}`,
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
    let dom: JSDOM

    try {
      dom = new JSDOM(html)
    } catch (err) {
      console.log("Error parsing html")
      throw new Error("Error parsing html")
    }

    const forecastHref = dom.window.document
      .querySelector('[data-testid="TodayWeatherModule"]')
      ?.querySelector('[data-testid="CardFooter"]')
      ?.querySelector("a")
      ?.getAttribute("href")

    if (!forecastHref) {
      throw new Error("Could not find forecast href")
    }

    const result = await this.$scrapeWeatherForecast.exec(
      `https://weather.com${forecastHref}`
    )

    await this.redis.set(
      redisKeys.weatherForecast(query),
      JSON.stringify(result),
      "EX",
      60 * 5 // 5 min
    )

    return result
  }
}
