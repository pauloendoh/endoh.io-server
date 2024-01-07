import {
  Body,
  CurrentUser,
  JsonController,
  NotFoundError,
  Post,
} from "routing-controllers"
import { dataSource } from "../../dataSource"
import { DecisionTableItem } from "../../entities/BigDecisions/DecisionTableItem"
import { User } from "../../entities/User"
import { myConsoleError } from "../../utils/myConsoleError"

const itemRepo = dataSource.getRepository(DecisionTableItem)

@JsonController("/BigDecisions/decisionTableItem")
export class DecisionTableItemController {
  @Post("/")
  async saveItem(
    @CurrentUser({ required: true })
    user: User,
    @Body() sent: DecisionTableItem
  ) {
    try {
      if (sent.id) {
        const found = await itemRepo.findOne({
          where: { id: sent.id, userId: user.id },
        })

        if (!found) {
          throw new NotFoundError(`Doesn't exist or user doesn't own it.`)
        }
      }

      sent.userId = user.id
      const saved = await itemRepo.save(sent)
      return saved
    } catch (err) {
      myConsoleError(err.message)
      throw new NotFoundError(err.message)
    }
  }
}
