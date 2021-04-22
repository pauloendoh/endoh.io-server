import { User } from '../User';
export declare class Notification {
    id: number;
    user: User;
    userId: number;
    type: string;
    message: string;
    seen: boolean;
    follower: User;
    followerId: number;
    createdAt: Date;
    updatedAt: Date;
}
