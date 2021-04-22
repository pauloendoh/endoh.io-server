import { Repository } from 'typeorm';
import { SkillProgress } from '../../entities/skillbase/SkillProgress';
export default class ProgressRepository extends Repository<SkillProgress> {
    getAllFromUser(userId: number): Promise<SkillProgress[]>;
}
