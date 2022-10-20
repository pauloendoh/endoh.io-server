import { dataSource } from "../../dataSource"
import { SkillProgress } from "../../entities/skillbase/SkillProgress"

const ProgressRepository = dataSource.getRepository(SkillProgress).extend({
  async getAllFromUser(userId: number): Promise<SkillProgress[]> {
    return this.createQueryBuilder("progress")
      .where({ userId: userId })
      .leftJoinAndSelect("progress.skill", "skill")
      .orderBy("progress.createdAt", "DESC")
      .getMany()
  },
})

export default ProgressRepository
