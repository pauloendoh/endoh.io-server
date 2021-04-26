import { EntityRepository, Repository } from "typeorm"
import { Skill } from "../../entities/skillbase/Skill"

@EntityRepository(Skill)
export default class SkillRepository extends Repository<Skill> {
  async getAllFromUser(userId: number): Promise<Skill[]> {
    return this.createQueryBuilder("skill")
      .where({ userId: userId })
      .leftJoinAndSelect("skill.dependencies", "dependencies")
      .leftJoinAndSelect("skill.expectations", "expectations")
      .orderBy("skill.isPriority", "DESC")
      .addOrderBy("skill.goalLevel", "DESC")
      .addOrderBy("skill.currentLevel", "DESC")
      .getMany()
  }

  async deleteIdsFromUser(ids: number[], userId: number) {
    return this.createQueryBuilder("skill")
      .delete()
      .where({ userId: userId })
      .andWhere("skill.id IN (:...ids)", { ids: [...ids] })
      .execute()
  }

  async getByText(userId: number, text: string): Promise<Skill[]> {
    return this.createQueryBuilder("skill")
      .where({ userId: userId })
      .andWhere("skill.name ilike :text", { text: `%${text}%` })
      .leftJoinAndSelect("skill.dependencies", "dependencies")
      .orderBy("skill.isPriority", "DESC")
      .addOrderBy("skill.goalLevel", "DESC")
      .addOrderBy("skill.currentLevel", "DESC")
      .getMany()
  }
}
