import { Tag } from '../relearn/Tag';
import { User } from '../User';
export declare class FollowingTag {
    id: number;
    follower: User;
    followerId: number;
    followingUser: User;
    followingUserId: number;
    tag: Tag;
    tagId: number;
    createdAt: Date;
    updatedAt: Date;
}
