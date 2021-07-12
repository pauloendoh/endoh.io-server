import { EntityRepository, Repository } from "typeorm"
import { Decision } from "../../entities/BigDecisions/Decision"

@EntityRepository(Decision)
export default class DecisionRepository extends Repository<Decision> {
  async getAllFromUser(userId: number): Promise<Decision[]> {
    return this.find({
      where: { userId: userId },
      relations: ['tables', 'tables.items'],
      order: { isPriority: "DESC", updatedAt: "DESC" },
    })
  }

  async getFullDecision(decisionId: number): Promise<Decision>{
    return this.findOne({
      where: {id: decisionId}, 
      relations: ['tables', 'tables.items'],
      order: { isPriority: "DESC", updatedAt: "DESC" },
    })
  }
}
