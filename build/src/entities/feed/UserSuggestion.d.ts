import { User } from '../User';
export declare class UserSuggestion {
    id: number;
    user: User;
    userId: number;
    suggestedUser: User;
    suggestedUserId: number;
    description: string;
    dontShowUntil: string;
    createdAt: Date;
    updatedAt: Date;
}
