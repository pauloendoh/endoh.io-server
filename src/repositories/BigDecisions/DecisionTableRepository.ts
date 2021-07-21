import { EntityRepository, Repository } from "typeorm"
import { DecisionTable } from "../../entities/BigDecisions/DecisionTable"

@EntityRepository(DecisionTable)
export default class DecisionTableRepository extends Repository<DecisionTable> {
  async normalizeTablesPositions(decisionId: number): Promise<void> {
    return this.query(
      `
      update "decision_table" d 
         set "index" = d2."new_index" 
        from (select "id", 
                     "index", 
                     (ROW_NUMBER() OVER (ORDER BY "index") -1) as "new_index" 
                from "decision_table" 
               where "decisionId" = $1) as d2 
       where d.id = d2.id`,
      [decisionId]
    )
  }

  async sortProblemsByWeight(tableId: number, order: "asc" | "desc") {
    // for some reason, 'order' had to be interpolated because it didn't consider in the params[]
    return this.query(
      `update "decision_table_item" d 
          set "index" = d2."new_index" 
         from (select "id", 
                      (ROW_NUMBER() OVER (ORDER BY "weight" ${order}) -1) as  "new_index" 
                 from "decision_table_item" 
                where "decisionTableId" = $1) as d2 
        where d.id = d2.id`,
      [tableId]
    )
  }
}
