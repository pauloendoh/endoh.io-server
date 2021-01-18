import { EntityRepository, Repository } from 'typeorm';
import { SkillProgress } from '../../entities/skillbase/SkillProgress';

@EntityRepository(SkillProgress)
export default class ProgressRepository extends Repository<SkillProgress>{
    async getAllFromUser(userId: number): Promise<SkillProgress[]> {
        return this.createQueryBuilder("progress")
            .where({ userId: userId })
            .leftJoinAndSelect('progress.skill', 'skill')
            .getMany()
    }
}