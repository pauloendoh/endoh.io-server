import { Repository } from 'typeorm';
import { FeedResourceDto } from '../../dtos/feed/FeedResourceDto';
import { FollowerDto } from '../../dtos/feed/FollowerDto';
import { FollowingUserDto } from '../../dtos/feed/FollowingUserDto';
import { MostFollowedUser } from '../../dtos/feed/MostFollowedUser';
import { FollowingTag } from '../../entities/feed/FollowingTag';
import { User } from '../../entities/User';
export default class FollowingTagRepository extends Repository<FollowingTag> {
    getFollowingUsers(follower: User): Promise<FollowingUserDto[]>;
    getFollowers(user: User): Promise<FollowerDto[]>;
    getMostFollowedUsersByUsersYouFollow(you: User, returnUpTo?: number): Promise<MostFollowedUser[]>;
    getMostFollowedUsersByUsersYouDONTFollow(you: User, returnUpTo?: number): Promise<MostFollowedUser[]>;
    getFeedResources(user: User): Promise<FeedResourceDto[]>;
}
