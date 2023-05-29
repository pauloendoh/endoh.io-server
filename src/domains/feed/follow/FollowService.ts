import UserRepository from "../../../repositories/UserRepository"
import { NotificationService } from "../../notification/NotificationService"
import { FollowRepository } from "./FollowRepository"

export class FollowService {
  constructor(
    private followRepo = new FollowRepository(),
    private userRepo = UserRepository, // private notificationService = new NotificationService()
    private notificationService = new NotificationService()
  ) {}

  async toggleFollow(requesterId: number, followingUserId: number) {
    const alreadyFollowing = await this.followRepo.userAIsFollowingUserB(
      requesterId,
      followingUserId
    )

    if (!alreadyFollowing) {
      const follow = await this.followRepo.followUser(
        requesterId,
        followingUserId
      )
      this.notificationService.createFollowNotification(follow)

      return follow
    }

    await this.followRepo.deleteFollow(alreadyFollowing.id)

    return "deleted"
  }

  async findFollowingUsers(followerId: number) {
    return this.followRepo.findFolloweesByFollowerId(followerId)
  }

  async findFollowers(userId: number) {
    return this.followRepo.findFollowers(userId)
  }

  async findMostFollowedUsers() {
    const groupBy = await this.followRepo.findMostFollowedUsers()
    const userIds = groupBy.map((g) => g.followingUserId)

    return this.userRepo.findByUserIds(userIds)
  }
}
