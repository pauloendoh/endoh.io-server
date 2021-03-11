import { Tag } from '../../entities/relearn/Tag';

export interface MostFollowedUser {
    user: {
        userId: number,
        username: string,
    },
    count: number
}

