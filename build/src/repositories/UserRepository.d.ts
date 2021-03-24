import { DeleteResult, Repository } from 'typeorm';
import { UserProfileDto } from '../dtos/feed/UserProfileDto';
import { User } from '../entities/User';
export default class UserRepository extends Repository<User> {
    getAvailableUsernameByEmail(email: string): Promise<string>;
    getTemporaryUsers(): Promise<User[]>;
    getAvailableTempUsername(): Promise<string>;
    deleteExpiredTempUsers(): Promise<DeleteResult>;
    saveAndGetRelations: (user: User) => Promise<User>;
    getUsersByText(text: string): Promise<UserProfileDto[]>;
}
