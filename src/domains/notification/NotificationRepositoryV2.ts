import { dataSource } from "../../dataSource"
import { Notification } from "../../entities/feed/Notification"

export class NotificationRepositoryV2 {
  constructor(private db = dataSource) {}

  async deletePreviousFollowNotifications(params: {
    followedUserId: number
    followerId: number
  }) {
    const { followedUserId, followerId } = params
    return this.db.getRepository(Notification).delete({
      type: "follow",
      userId: followedUserId,
      followerId: followerId,
    })
  }

  async createFollowNotification(params: {
    followedUserId: number
    followerId: number
    username: string
  }) {
    const { followedUserId, followerId, username } = params

    return this.db.getRepository(Notification).save({
      userId: followedUserId,
      type: "follow",
      followerId: followerId,
      message: `${username} is following you`,
    })
  }
}
