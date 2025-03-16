import { initContract } from "@ts-rest/core"
import { RouterImplementation } from "@ts-rest/express/src/lib/types"
import { questionC } from "./define/questionC"
import { questionRouter } from "./define/questionRouter"

const c = initContract()

export const contract = c.router({
  question: questionC,
})

export const contractServerRouter: RouterImplementation<typeof contract> = {
  question: questionRouter,
}
