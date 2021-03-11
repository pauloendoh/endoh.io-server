import { Tag } from '../../entities/relearn/Tag';

export interface UserSuggestionDto {
    id: number,
    suggestedUserId: string,
    description: string,
    username: string,
    fullName: string
}

