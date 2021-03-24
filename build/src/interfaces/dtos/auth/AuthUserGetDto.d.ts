import { UserPreference } from '../../../entities/UserPreference';
import { User } from '../../../entities/User';
export declare class AuthUserGetDto {
    id: number;
    username: string;
    email: string;
    preference: UserPreference;
    token: string;
    expiresAt: Date;
    constructor(user: User, token: string, expiresAt: Date);
}
