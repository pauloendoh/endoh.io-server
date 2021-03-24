import { FollowingTag } from '../feed/FollowingTag';
import { Skill } from '../skillbase/Skill';
import { User } from '../User';
import { Resource } from './Resource';
export declare class Tag {
    id: number;
    user: User;
    userId: number;
    resources: Resource[];
    skills: Skill[];
    tagFollowers: FollowingTag[];
    name: string;
    position: number;
    color: string;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
}
