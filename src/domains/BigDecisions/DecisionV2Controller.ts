import {
  BadRequestError,
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
} from "routing-controllers"
import { dataSource } from "../../dataSource"
import { Decision } from "../../entities/BigDecisions/Decision"
import { DecisionTableItem } from "../../entities/BigDecisions/DecisionTableItem"
import { User } from "../../entities/User"
import DecisionRepository from "../../repositories/BigDecisions/DecisionRepository"
import DecisionTableRepository from "../../repositories/BigDecisions/DecisionTableRepository"
import { myConsoleError } from "../../utils/myConsoleError"

const repo = DecisionTableRepository
const itemRepo = dataSource.getRepository(DecisionTableItem)

const decisionRepo = DecisionRepository

@JsonController("/v2/BigDecisions/decision")
export class DecisionTableItemController {
  @Post("/")
  async saveItem(
    @CurrentUser({ required: true })
    user: User,
    @Body() sentDecision: Decision
  ) {
    try {
      if (sentDecision.id) {
        // TODO
        // check ownership
        const decision = await decisionRepo.findOne({
          where: { id: sentDecision.id, userId: user.id },
        })

        if (!decision) {
          throw new BadRequestError(`Doc doesn't exist or user doesn't own it.`)
        }
      }

      sentDecision.userId = user.id
      const saved = await decisionRepo.save(sentDecision)
      const fullSaved = await decisionRepo.getFullDecision(saved.id)

      // const allDecisions = await decisionRepo.getAllFromUser(req.user.id)
      return fullSaved
    } catch (err) {
      myConsoleError(err.message)
      throw new BadRequestError(err.message)
    }
  }

  @Get("/")
  async getAll(
    @CurrentUser({ required: true })
    user: User
  ) {
    try {
      const allDecisions = await decisionRepo.getAllFromUser(user.id)
      return allDecisions
    } catch (err) {
      myConsoleError(err.message)
      throw new BadRequestError(err.message)
    }
  }

  @Delete("/:id")
  async deleteDecision(
    @CurrentUser({ required: true })
    user: User,
    @Param("id") id: string
  ) {
    const decisionId = parseFloat(id)

    try {
      const decision = await decisionRepo.findOne({
        where: { id: decisionId, userId: user.id },
      })

      if (!decision) {
        throw new BadRequestError(`Doc doesn't exist or user doesn't own it.`)
      }

      await decisionRepo.remove(decision)
      return "OK"
    } catch (err) {
      myConsoleError(err.message)
      throw new BadRequestError(err.message)
    }
  }
}
