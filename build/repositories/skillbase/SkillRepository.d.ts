import { Repository } from 'typeorm';
import { Skill } from '../../entities/skillbase/Skill';
export default class SkillRepository extends Repository<Skill> {
    getAllFromUser(userId: number): Promise<Skill[]>;
    deleteIdsFromUser(ids: number[], userId: number): Promise<import("typeorm").DeleteResult>;
    getByText(userId: number, text: string): Promise<Skill[]>;
}
