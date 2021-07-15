import { EntityRepository, Repository } from "typeorm"
import { DecisionTable } from "../../entities/BigDecisions/DecisionTable"

@EntityRepository(DecisionTable)
export default class DecisionTableRepository extends Repository<DecisionTable> {
  // async getAllFromUser(userId: number): Promise<Decision[]> {
  //   return this.createQueryBuilder("decision")
  //     .where({ userId })
  //     .leftJoinAndSelect("decision.tables", "table")
  //     .leftJoinAndSelect("table.items", "item")
  //     .orderBy("decision.isPriority", "DESC")
  //     .addOrderBy("decision.updatedAt", "DESC")
  //     .addOrderBy("table.index", "ASC")
  //     .addOrderBy("item.index", "ASC")
  //     .getMany()
  // }
  // async getFullDecision(id: number): Promise<Decision> {
  //   return this.createQueryBuilder("decision")
  //     .where({ id })
  //     .leftJoinAndSelect("decision.tables", "table")
  //     .leftJoinAndSelect("table.items", "item")
  //     .orderBy("decision.isPriority", "DESC")
  //     .addOrderBy("decision.updatedAt", "DESC")
  //     .addOrderBy("table.index", "ASC")
  //     .addOrderBy("item.index", "ASC")
  //     .getOne()
  // }
}
