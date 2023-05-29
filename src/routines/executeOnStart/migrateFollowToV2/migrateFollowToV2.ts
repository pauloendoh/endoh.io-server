import { dataSource } from "../../../dataSource"
import { FollowService } from "../../../domains/feed/follow/FollowService"
import { Follow } from "../../../entities/feed/Follow"
import { myConsoleError } from "../../../utils/myConsoleError"
import { myConsoleSuccess } from "../../../utils/myConsoleSuccess"

export async function migrateFollowToV2() {
  try {
    const db = dataSource

    const follows: {
      followerId: number
      followingUserId: number
    }[] = await db.query(`
      SELECT "followerId", 
             "followingUserId" 
        FROM following_tag ft 
    GROUP BY "followerId", 
             "followingUserId"`)

    const followService = new FollowService()

    for (const follow of follows) {
      const alreadyFollowing = await db.getRepository(Follow).findOne({
        where: {
          followerId: follow.followerId,
          followedUserId: follow.followingUserId,
        },
      })

      if (alreadyFollowing) {
        continue
      }

      await followService.toggleFollow(
        follow.followerId,
        follow.followingUserId
      )

      myConsoleSuccess(
        `Migrated follow from ${follow.followerId} to ${follow.followingUserId}`
      )
    }

    myConsoleSuccess("Migrated all follows to v2")
  } catch (e) {
    myConsoleError(e.message)
  }
}
