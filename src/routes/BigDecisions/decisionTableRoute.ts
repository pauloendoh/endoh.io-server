import { plainToClass } from "class-transformer"
import { Router } from "express"
import { getCustomRepository } from "typeorm"
import { DecisionTable } from "../../entities/BigDecisions/DecisionTable"
import authMiddleware from "../../middlewares/authMiddleware"
import DecisionRepository from "../../repositories/BigDecisions/DecisionRepository"
import DecisionTableRepository from "../../repositories/BigDecisions/DecisionTableRepository"
import { MyErrorsResponse } from "../../utils/ErrorMessage"
import { MyAuthRequest } from "../../utils/MyAuthRequest"
import { myConsoleError } from "../../utils/myConsoleError"

const tableRoute = Router()
const repo = getCustomRepository(DecisionTableRepository)
const decisionRepo = getCustomRepository(DecisionRepository)

tableRoute.delete("/:id", authMiddleware, async (req: MyAuthRequest, res) => {
  const tableId = Number(req.params.id)

  try {
    const table = await repo.findOne({
      where: { id: tableId, userId: req.user.id },
    })

    if (!table) {
      return res
        .status(400)
        .json(new MyErrorsResponse(`Doc doesn't exist or user doesn't own it.`))
    }

    await repo.remove(table)
    return res.status(200).json()
  } catch (err) {
    myConsoleError(err.message)
    return res.status(400).json(new MyErrorsResponse(err.message))
  }
})

tableRoute.post("/", authMiddleware, async (req: MyAuthRequest, res) => {
  try {
    const sent = plainToClass(DecisionTable, req.body)

    if (sent.id) {
      const found = await repo.findOne({
        where: { id: sent.id, userId: req.user.id },
      })

      if (!found) {
        return res
          .status(400)
          .json(new MyErrorsResponse(`Doesn't exist or user doesn't own it.`))
      }
    }

    sent.userId = req.user.id
    const saved = await repo.save(sent)

    const fullDecision = await decisionRepo.getFullDecision(saved.decisionId)
    return res.status(200).json(fullDecision)
  } catch (err) {
    myConsoleError(err.message)
    return res.status(400).json(new MyErrorsResponse(err.message))
  }
})

tableRoute.post(
  "/sortProblemsByWeight",
  authMiddleware,
  async (req: MyAuthRequest, res) => {
    try {
      const { tableId: decisionTableId, order } = req.body as {
        tableId: number
        order: "asc" | "desc"
      }

      // ownership
      const table = await repo.findOne({
        where: { id: decisionTableId, userId: req.user.id },
      })

      if (!table) {
        return res
          .status(400)
          .json(new MyErrorsResponse(`Doesn't exist or user doesn't own it.`))
      }

      // sorting by order
      if (order !== "asc" && order !== "desc")
        return res.status(400).json(new MyErrorsResponse(`Invalid order`))
      await repo.sortProblemsByWeight(table.id, order)

      const fullDecision = await decisionRepo.getFullDecision(table.decisionId)
      return res.status(200).json(fullDecision)
    } catch (err) {
      myConsoleError(err.message)
      return res.status(400).json(new MyErrorsResponse(err.message))
    }
  }
)

export default tableRoute
