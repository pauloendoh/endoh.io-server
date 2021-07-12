import {
  EntitySubscriberInterface,
  EventSubscriber,
  getCustomRepository,
  InsertEvent,
} from "typeorm"
import { DecisionTable } from "../entities/BigDecisions/DecisionTable"
import DecisionRepository from "../repositories/BigDecisions/DecisionRepository"
import { myConsoleError } from "../utils/myConsoleError"

@EventSubscriber()
export class DecisionTableSubscriber
  implements EntitySubscriberInterface<DecisionTable> {
  listenTo() {
    return DecisionTable
  }

  async afterInsert(event: InsertEvent<DecisionTable>) {
    try {
      const decisionRepo = event.manager.getCustomRepository(DecisionRepository)
      const decision = await decisionRepo.findOne({
        where: { id: event.entity.decisionId },
        relations: ["tables"],
      })

      // since it's an after insert, you gotta get all -1
      event.entity.index = decision.tables.length - 1

      const thisRepo = event.manager.getRepository(DecisionTable)
      await thisRepo.save(event.entity)

    } catch (e) {
      myConsoleError(e.message)
    }
  }
}
