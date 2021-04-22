import { Tag } from '../../entities/relearn/Tag';
export interface FollowerDto {
    follower: {
        userId: number;
        username: string;
        fullName: string;
        pictureUrl: string;
    };
    tags: Tag[];
}
