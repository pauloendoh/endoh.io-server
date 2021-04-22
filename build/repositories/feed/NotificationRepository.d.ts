import { Repository } from 'typeorm';
import { FollowTagDto } from '../../dtos/feed/FollowTagDto';
import { NotificationDto } from '../../dtos/utils/NotificationDto';
import { Notification } from '../../entities/feed/Notification';
import { User } from '../../entities/User';
export default class NotificationRepository extends Repository<Notification> {
    createFollowingNotification(follower: User, followedUser: User, followingTags: FollowTagDto[]): Promise<Notification>;
    createSavedResourceNotification(saverId: number, resourceId: number): Promise<Notification>;
    getNotifications(userId: number): Promise<NotificationDto[]>;
}
