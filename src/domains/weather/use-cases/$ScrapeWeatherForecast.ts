import axios from "axios"
import { myJSDOMDocument } from "../../../utils/runMyJSDOM"

export class $ScrapeWeatherForecast {
  async exec(
    pageUrl: string //eg: https://weather.com/weather/hourbyhour/l/a1682c5b5ed821610629ab24550e0251b434001f5e3136bf37abe590cd7aa18d
  ) {
    const html = await axios
      .get(pageUrl, {
        headers: {
          "twc-unit": "m",
        },
      })
      .then((res) => res.data)

    const document = myJSDOMDocument(html)
    if (!document) {
      throw new Error("Error parsing html")
    }

    const summaryDivs = document.querySelectorAll(
      '[data-testid="DetailsSummary"]'
    )

    const rawData = Array.from(summaryDivs).map((div) => {
      const time = div.querySelector('[data-testid="daypartName"]')?.textContent

      const temperature = div.querySelector(
        '[data-testid="TemperatureValue"]'
      )?.textContent

      const svgEl = div.querySelector("svg")

      // svg sibling
      const description = svgEl?.nextElementSibling?.textContent

      return {
        time,
        temperature,
        description,
      }
    })

    /**
     * {
  time: "9 pm",
  temperature: "84°",
  svg: "<svg class=\"DetailsSummary--wxIcon--kg5jB Icon--icon--ySD-o Icon--fullTheme--24H1f\" set=\"weather\" skycode=\"31\" theme=\"full\" name=\"\" data-testid=\"Icon\" viewBox=\"0 0 200 200\"><title>Clear Night</title><use xlink:href=\"#svg-symbol-moon\" transform=\"matrix(2.07 0 0 2.07 -72 3)\"></use><use xlink:href=\"#svg-symbol-star\" transform=\"translate(-4 -1)\"></use><use xlink:href=\"#svg-symbol-star\" transform=\"matrix(.8 0 0 .8 62 78)\"></use></svg>",
  description: "Clear",
}
     */

    const parsedData = rawData.map((data) => {
      return {
        time: data.time ?? undefined,
        temperature: data.temperature ? parseInt(data.temperature) : undefined,
        description: data.description ?? undefined,
      }
    })

    return parsedData
  }
}
