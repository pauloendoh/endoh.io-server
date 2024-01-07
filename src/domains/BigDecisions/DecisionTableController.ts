import {
  BadRequestError,
  Body,
  CurrentUser,
  Delete,
  JsonController,
  NotFoundError,
  Param,
  Post,
} from "routing-controllers"
import { DecisionTable } from "../../entities/BigDecisions/DecisionTable"
import { User } from "../../entities/User"
import DecisionRepository from "../../repositories/BigDecisions/DecisionRepository"
import DecisionTableRepository from "../../repositories/BigDecisions/DecisionTableRepository"
import { myConsoleError } from "../../utils/myConsoleError"

const repo = DecisionTableRepository
const decisionRepo = DecisionRepository

@JsonController("/BigDecisions/decisionTable")
export class DecisionTableController {
  @Delete("/:id")
  async deleteQuestion(
    @CurrentUser({ required: true })
    user: User,
    @Param("id") id: string
  ) {
    const tableId = Number(id)

    try {
      const table = await repo.findOne({
        where: { id: tableId, userId: user.id },
      })

      if (!table) {
        throw new NotFoundError(`Doc doesn't exist or user doesn't own it.`)
      }

      await repo.remove(table)
      return "OK"
    } catch (err) {
      myConsoleError(err.message)
      throw new NotFoundError(err.message)
    }
  }

  @Post("/")
  async saveQuestion(
    @CurrentUser({ required: true })
    user: User,
    @Body() sent: DecisionTable
  ) {
    try {
      if (sent.id) {
        const found = await repo.findOne({
          where: { id: sent.id, userId: user.id },
        })

        if (!found) {
          throw new NotFoundError(`Doesn't exist or user doesn't own it.`)
        }
      }

      sent.userId = user.id
      const saved = await repo.save(sent)

      const fullDecision = await decisionRepo.getFullDecision(saved.decisionId)
      return fullDecision
    } catch (err) {
      myConsoleError(err.message)
      throw new BadRequestError(err.message)
    }
  }

  @Post("/sortProblemsByWeight")
  async sortProblemsByWeight(
    @CurrentUser({ required: true })
    user: User,
    @Body() body: { tableId: number; order: "asc" | "desc" }
  ) {
    try {
      const { tableId: decisionTableId, order } = body

      const found = await repo.findOne({
        where: { id: decisionTableId, userId: user.id },
      })

      if (!found) {
        throw new BadRequestError(`Doesn't exist or user doesn't own it.`)
      }

      // sorting by order
      if (order !== "asc" && order !== "desc")
        throw new BadRequestError(`Invalid order`)

      await repo.sortProblemsByWeight(found.id, order)

      const fullDecision = await decisionRepo.getFullDecision(found.decisionId)
      return fullDecision
    } catch (err) {
      myConsoleError(err.message)
      throw new BadRequestError(err.message)
    }
  }
}
