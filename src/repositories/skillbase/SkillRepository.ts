import { EntityRepository, Repository } from 'typeorm';
import { Skill } from '../../entities/skillbase/Skill';

@EntityRepository(Skill)
export default class SkillRepository extends Repository<Skill>{
    async getAllFromUser(userId: number): Promise<Skill[]> {
        return this.createQueryBuilder("skill")
            .where({ userId: userId })
            .leftJoinAndSelect('skill.dependencies', 'dependencies')
            .orderBy("skill.currentLevel", "DESC")
            .addOrderBy("skill.goalLevel", "DESC")
            .addOrderBy("skill.isPriority", "DESC")
            .getMany()
    }

    async deleteIdsFromUser(ids: number[], userId: number) {
        return this.createQueryBuilder("skill")
            .delete()
            .where({ userId: userId })
            .andWhere("skill.id IN (:...ids)", { ids: [...ids] })
            .execute()


    }
}