import {
  EntitySubscriberInterface,
  EventSubscriber,
  getCustomRepository,
  InsertEvent,
  RemoveEvent,
} from "typeorm"
import { DecisionTable } from "../entities/BigDecisions/DecisionTable"
import { DecisionTableItem } from "../entities/BigDecisions/DecisionTableItem"
import DecisionRepository from "../repositories/BigDecisions/DecisionRepository"
import DecisionTableRepository from "../repositories/BigDecisions/DecisionTableRepository"
import { myConsoleError } from "../utils/myConsoleError"

@EventSubscriber()
export class DecisionTableSubscriber
  implements EntitySubscriberInterface<DecisionTable> {
  listenTo() {
    return DecisionTable
  }

  async afterInsert(event: InsertEvent<DecisionTable>) {
    try {
      // divide into two separated functions...

      // secures table.position
      const decisionRepo = event.manager.getCustomRepository(DecisionRepository)
      const decision = await decisionRepo.findOne({
        where: { id: event.entity.decisionId },
        relations: ["tables"],
      })
      // since it's an after insert, you gotta get all -1
      event.entity.index = decision.tables.length - 1
      const thisRepo = event.manager.getRepository(DecisionTable)
      await thisRepo.save(event.entity)

      // start with one empty problem
      const problemRepo = event.manager.getRepository(DecisionTableItem)
      await problemRepo.save({
        decisionTableId: event.entity.id,
        userId: event.entity.userId,
        problem: "",
        solution: "",
        weight: 1
      }) 
    } catch (e) {
      myConsoleError(e.message)
    }
  }

  async afterRemove(event: RemoveEvent<DecisionTable>) {
    try {
      const repo = event.manager.getCustomRepository(DecisionTableRepository)
      const ok = await repo.normalizeTablesPositions(event.entity.decisionId)
      return
    } catch (e) {
      myConsoleError(e.message)
    }
  }
}
