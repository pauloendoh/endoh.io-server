import {
  EntitySubscriberInterface,
  EventSubscriber, InsertEvent
} from "typeorm"
import { Decision } from "../entities/BigDecisions/Decision"
import { DecisionTable } from "../entities/BigDecisions/DecisionTable"
import { myConsoleError } from "../utils/myConsoleError"

@EventSubscriber()
export class DecisionSubscriber implements EntitySubscriberInterface<Decision> {

  listenTo() {
    return Decision
  }

  // Creates two default tables ("yes, no")
  async afterInsert(event: InsertEvent<Decision>) {
    try {
      const { entity } = event
      const tableRepo = event.manager.getRepository(DecisionTable)

      const table1 = await tableRepo.save({
        userId: entity.userId,
        decisionId: entity.id,
        title: "Yes"
      })

      const table2 = await tableRepo.save({
        userId: entity.userId,
        decisionId: entity.id,
        title: "No"
      })
      entity.tables = [table1, table2]
    } catch (e) {
      myConsoleError(e.message)
    }
  }
}
