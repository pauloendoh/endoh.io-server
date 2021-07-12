import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm"
import { DecisionTableItem } from "../entities/BigDecisions/DecisionTableItem"
import { myConsoleError } from "../utils/myConsoleError"

@EventSubscriber()
export class DecisionTableItemSubscriber
  implements EntitySubscriberInterface<DecisionTableItem> {
  listenTo() {
    return DecisionTableItem
  }

  // Always add as last index
  async afterInsert(event: InsertEvent<DecisionTableItem>) {
    try {
      // const decisionRepo = event.manager.getCustomRepository(DecisionRepository)
      // const decision = await decisionRepo.findOne({
      //   where: { id: event.entity.decisionId },
      //   relations: ["tables"],
      // })
      // // since it's an after insert, you gotta get all -1
      // event.entity.index = decision.tables.length - 1
      // const thisRepo = event.manager.getRepository(DecisionTable)
      // await thisRepo.save(event.entity)
    } catch (e) {
      myConsoleError(e.message)
    }
  }
}
