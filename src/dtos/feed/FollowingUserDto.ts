import { Tag } from '../../entities/relearn/Tag';

export interface FollowingUserDto {
    followingUser: {
        userId: number,
        username: string,
        fullName: string,
        pictureUrl: string,
    },
    tags: Tag[]
}

