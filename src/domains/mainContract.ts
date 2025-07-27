import { initContract } from "@ts-rest/core"
import { RouterImplementation } from "@ts-rest/express/src/lib/types"
import { questionContract } from "./define/questionContract"
import { questionRouter } from "./define/questionRouter"
import { gotItContract } from "./got-it/got-it.contract"
import { gotItController } from "./got-it/got-it.controller"
import { weatherContract } from "./weather/weather.contract"
import { weatherController } from "./weather/weather.controller"

const c = initContract()

export const mainContract = c.router({
  question: questionContract,
  gotIt: gotItContract,
  weather: weatherContract,
})

export const controllers: RouterImplementation<typeof mainContract> = {
  question: questionRouter,
  gotIt: gotItController,
  weather: weatherController,
}
