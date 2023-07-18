import { dataSource } from "../../dataSource"
import { Decision } from "../../entities/BigDecisions/Decision"

const DecisionRepository = dataSource.getRepository(Decision).extend({
  async getAllFromUser(userId: number): Promise<Decision[]> {
    return this.createQueryBuilder("decision")
      .where({ userId })
      .leftJoinAndSelect("decision.tables", "table")
      .leftJoinAndSelect("table.items", "item")
      .orderBy("decision.isPriority", "DESC")
      .addOrderBy("decision.createdAt", "DESC")
      .addOrderBy("table.createdAt", "ASC")
      .addOrderBy("item.index", "ASC")
      .getMany()
  },

  async getFullDecision(id: number): Promise<Decision | null> {
    return this.createQueryBuilder("decision")
      .where({ id })
      .leftJoinAndSelect("decision.tables", "table")
      .leftJoinAndSelect("table.items", "item")
      .orderBy("decision.isPriority", "DESC")
      .addOrderBy("decision.createdAt", "DESC")
      .addOrderBy("table.createdAt", "ASC")
      .addOrderBy("item.index", "ASC")
      .getOne()
  },
})

export default DecisionRepository
