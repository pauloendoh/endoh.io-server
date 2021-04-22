import { User } from './User';
export declare class UserToken {
    id: number;
    user: User;
    userId: number;
    type: string;
    token: string;
    expiresAt: string;
    createdAt: Date;
    updatedAt: Date;
}
