import { EntityRepository, getCustomRepository, getRepository, Repository } from 'typeorm';
import { FollowTagDto } from '../../dtos/feed/FollowTagDto';
import { NotificationDto } from '../../dtos/utils/NotificationDto';
import { Notification } from '../../entities/feed/Notification';
import { Profile } from '../../entities/feed/Profile';
import { User } from '../../entities/User';
import TagRepository from '../relearn/TagRepository';

@EntityRepository(Notification)
export default class NotificationRepository extends Repository<Notification>{

  async createFollowingNotification(follower: User, followedUser: User, followingTags: FollowTagDto[]): Promise<Notification> {

    const followerProfile = await getRepository(Profile)
      .findOne({ where: { userId: follower.id } })

    const tagRepo = getCustomRepository(TagRepository)

    // building message
    let message = `${follower.username} is following you in `;
    let index = 0;
    for (const followingTag of followingTags) {
      const tag = await tagRepo.findOne({ where: { id: followingTag.tagId } })

      if (followingTags.length === 1) { // if only one
        message += `"${tag.name}"`
      } else if (index === followingTags.length - 1) { // if last one
        message += `and "${tag.name}"`
      } else { // if not last one
        message += `"${tag.name}", `
      }

      index++
    }


    // remove any previous notification of this type from the follower 
    this.delete({ type: "follow", userId: followedUser.id, followerId: follower.id })

    return this.save({
      type: "follow",
      userId: followedUser.id,
      message: message,
      followerId: follower.id,
    })
  }


  async getNotifications(userId: number): Promise<NotificationDto[]> {
    return this.query(`
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
  order by ntf."createdAt" desc`, [userId])
  }

}

