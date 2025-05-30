import { NotFoundError } from "routing-controllers"
import { dataSource } from "../../dataSource"
import { TagFollowPostDto } from "../../dtos/feed/TagFollowPostDto"
import { NotificationDto } from "../../dtos/utils/NotificationDto"
import { User } from "../../entities/User"
import { Notification } from "../../entities/feed/Notification"
import { Profile } from "../../entities/feed/Profile"
import ResourceRepository from "../relearn/ResourceRepository"
import TagRepository from "../relearn/TagRepository"

// PE 1/3 - transform in a proper Repository
const NotificationRepository = dataSource.getRepository(Notification).extend({
  async createFollowNotificationV2(followId: number) {},
  async createFollowingNotification(
    follower: User,
    followedUser: User,
    followingTags: TagFollowPostDto[]
  ): Promise<Notification> {
    const followerProfile = await dataSource.getRepository(Profile).findOne({
      where: { userId: follower.id },
    })

    const tagRepo = TagRepository

    // building message
    let message = `${follower.username} is following you in `
    let index = 0
    for (const followingTag of followingTags) {
      const tag = await tagRepo.findOne({ where: { id: followingTag.tagId } })

      if (!tag) {
        continue
      }

      if (followingTags.length === 1) {
        // if only one
        message += `"${tag.name}"`
      } else if (index === followingTags.length - 1) {
        // if last one
        message += `and "${tag.name}"`
      } else {
        // if not last one
        message += `"${tag.name}", `
      }

      index++
    }

    // remove any previous notification of this type from the follower
    this.delete({
      type: "follow",
      userId: followedUser.id,
      followerId: follower.id,
    })
    return this.save({
      type: "follow",
      userId: followedUser.id,
      message: message,
      followerId: follower.id,
    })
  },

  async createSavedResourceNotification(
    saverId: number,
    resourceId: number
  ): Promise<Notification> {
    try {
      const resourceRepo = ResourceRepository
      const userRepo = dataSource.getRepository(User)

      const resource = await resourceRepo.findOne({
        where: { id: resourceId },
      })

      if (!resource) {
        throw new NotFoundError("Resource not found")
      }

      const owner = await userRepo.findOne({ where: { id: resource.userId } })
      if (!owner) {
        throw new NotFoundError("Owner not found")
      }

      const saver = await userRepo.findOne({
        where: {
          id: saverId,
        },
      })

      if (!saver) {
        throw new NotFoundError("Saver not found")
      }

      return this.save({
        type: "userSavedYourResource",
        userId: owner.id,
        message: `${saver.username} saved your resource: ${resource.title}`,
        followerId: saverId,
      })
    } catch (err) {
      throw err
    }
  },

  async getNotifications(userId: number): Promise<NotificationDto[]> {
    return this.query(
      `
    select ntf."id",
		   ntf."seen",
		   ntf."message",
		   ntf."createdAt",
		   ntf."userId",
		   usu."username",
		   pro."fullName",
		   pro."pictureUrl"
	  from "notification" 	ntf
inner join "user"			usu on usu."id" = ntf."followerId"
inner join "profile"		pro on pro."userId" = ntf."followerId"
     where ntf."userId" = $1
  order by ntf."createdAt" desc`,
      [userId]
    )
  },
})

export default NotificationRepository
