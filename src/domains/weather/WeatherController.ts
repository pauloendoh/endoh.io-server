import axios from "axios"
import { JSDOM } from "jsdom"
import { Get, JsonController, QueryParams } from "routing-controllers"
import { $ScrapeWeatherForecast } from "./use-cases/$ScrapeWeatherForecast"

@JsonController()
export class WeatherController {
  constructor(
    private readonly $scrapeWeatherForecast = new $ScrapeWeatherForecast()
  ) {}

  @Get("/weather-forecast")
  async getWeatherForecast(
    @QueryParams() params: { lat: number; lon: number; cachedObject: object }
  ) {
    const html = await axios
      .get<string>(
        `https://weather.com/weather/today/l/${params.lat},${params.lon}`,
        {
          headers: {
            "twc-unit": "m",
          },
        }
      )
      .then((res) => res.data)

    const dom = new JSDOM(html)

    const forecastHref = dom.window.document
      .querySelector('[data-testid="TodayWeatherModule"]')
      ?.querySelector('[data-testid="CardFooter"]')
      ?.querySelector("a")
      ?.getAttribute("href")

    if (!forecastHref) {
      throw new Error("Could not find forecast href")
    }

    return this.$scrapeWeatherForecast.exec(
      `https://weather.com${forecastHref}`
    )
  }
}
