import { NotFoundError } from "routing-controllers"
import { Follow } from "../../entities/feed/Follow"
import { UserRepositoryV2 } from "../user/UserRepositoryV2"
import { NotificationRepositoryV2 } from "./NotificationRepositoryV2"

export class NotificationService {
  constructor(
    private userRepo = new UserRepositoryV2(),
    private notificationRepo = new NotificationRepositoryV2()
  ) {}

  async createFollowNotification(follow: Follow) {
    const [follower, followedUser] = await Promise.all([
      this.userRepo.findById(follow.followerId),
      this.userRepo.findById(follow.followedUserId),
    ])

    if (!follower) {
      throw new NotFoundError("Follower not found.")
    }

    if (!followedUser) {
      throw new NotFoundError("Followed user not found.")
    }

    await this.notificationRepo.deletePreviousFollowNotifications({
      followedUserId: followedUser.id,
      followerId: follower.id,
    })

    return this.notificationRepo.createFollowNotification({
      followedUserId: followedUser.id,
      followerId: follower.id,
      username: follower.username,
    })
  }
}
