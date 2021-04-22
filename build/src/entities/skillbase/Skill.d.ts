import { Tag } from '../relearn/Tag';
import { User } from '../User';
import { SkillProgress } from './SkillProgress';
export declare class Skill {
    id: number;
    user: User;
    userId: number;
    progresses: SkillProgress[];
    dependencies: Skill[];
    childDependencies: Skill[];
    tag: Tag;
    tagId: number;
    isPriority: boolean;
    name: string;
    currentLevel: number;
    goalLevel: number;
    createdAt: string;
    updatedAt: string;
}
