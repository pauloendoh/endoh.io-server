import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm"
import { DecisionTable } from "../entities/BigDecisions/DecisionTable"
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
      const tableRepo = event.manager.getRepository(DecisionTable)
      const table = await tableRepo.findOne({
        where: { id: event.entity.decisionTableId },
        relations: ["items"],
      })

      // since it's after an insert, you gotta disconsider this same item
      event.entity.index = table.items.length - 1

      const repo = event.manager.getRepository(DecisionTableItem)
      await repo.save(event.entity)
    } catch (e) {
      myConsoleError(e.message)
    }
  }
}
