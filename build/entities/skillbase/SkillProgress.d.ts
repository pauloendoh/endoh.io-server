import { User } from '../User';
import { Skill } from './Skill';
export declare class SkillProgress {
    id: number;
    user: User;
    userId: number;
    skill: Skill;
    skillId: number;
    oldLevel: number;
    newLevel: number;
    goalLevel: number;
    createdAt: string;
    updatedAt: string;
}
