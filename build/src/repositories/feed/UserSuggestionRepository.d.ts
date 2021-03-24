import { Repository } from 'typeorm';
import { UserSuggestionDto } from '../../dtos/feed/UserSuggestionDto';
import { UserSuggestion } from '../../entities/feed/UserSuggestion';
import { User } from '../../entities/User';
export default class UserSuggestionRepository extends Repository<UserSuggestion> {
    getUserSuggestions(forUser: User): Promise<UserSuggestionDto[]>;
}
