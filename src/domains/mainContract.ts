import { initContract } from "@ts-rest/core"
import { RouterImplementation } from "@ts-rest/express/src/lib/types"
import { questionContract } from "./define/questionContract"
import { questionRouter } from "./define/questionRouter"

const c = initContract()

export const mainContract = c.router({
  question: questionContract,
})

export const contractServerRouter: RouterImplementation<typeof mainContract> = {
  question: questionRouter,
}
