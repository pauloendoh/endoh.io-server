import { Router } from "express"
import { getRepository } from "typeorm"
import { DecisionTableItem } from "../../entities/BigDecisions/DecisionTableItem"

// PE 1/3 - not being used... delete?
const itemRoute = Router()
const itemRepo = getRepository(DecisionTableItem)

// itemRoute.get("/", authMiddleware, async (req: MyAuthRequest, res) => {
//   try {
//     // const allDecisions = await decisionRepo.getAllFromUser(req.user.id)
//     // return res.status(200).json(allDecisions)
//   } catch (err) {
//     myConsoleError(err.message)
//     return res.status(400).json(new MyErrorsResponse(err.message))
//   }
// })

// itemRoute.post("/", authMiddleware, async (req: MyAuthRequest, res) => {
//   const sentItem = req.body as DecisionTableItem
//   const { user } = req

//   try {
//     if (sentItem.id) {
//       // TODO
//       // check ownership
//       const item = await itemRepo.findOne({
//         where: { id: sentItem.id, userId: user.id },
//       })

//       if (!item) {
//         return res
//           .status(400)
//           .json(
//             new MyErrorsResponse(`Doc doesn't exist or user doesn't own it.`)
//           )
//       }
//     } else {
//       sentItem.userId = req.user.id
//     }

//     const saved = await itemRepo.save(sentItem)

//     // const allDecisions = await itemRepo.getAllFromUser(req.user.id)
//     return res.status(200).json(saved)
//   } catch (err) {
//     myConsoleError(err.message)
//     return res.status(400).json(new MyErrorsResponse(err.message))
//   }
// })

export default itemRoute
