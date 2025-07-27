import { RouterImplementation } from "@ts-rest/express/src/lib/types"
import { userRequiredMiddleware } from "../../middlewares/userRequiredMiddleware"
import { gotItContract } from "./got-it.contract"
import { GotItService } from "./GotItService"

const gotItService = new GotItService()

export const gotItController: RouterImplementation<typeof gotItContract> = {
  getUserGotIt: {
    middleware: [userRequiredMiddleware],
    handler: async ({ req }) => {
      const gotIt = await gotItService.findOrCreateUserGotIt(req.user!.id)

      return {
        status: 200,
        body: gotIt,
      }
    },
  },
  updateUserGotIt: {
    middleware: [userRequiredMiddleware],
    handler: async ({ req, body }) => {
      const updatedGotIt = await gotItService.updateUserGotIt(req.user!.id, {
        createTag: body.createTag,
      })

      return {
        status: 200,
        body: updatedGotIt,
      }
    },
  },
}
