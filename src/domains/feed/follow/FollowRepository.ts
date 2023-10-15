import { dataSource } from "../../../dataSource"
import { Follow } from "../../../entities/feed/Follow"
import { userToSimpleUserDto } from "../../../utils/domain/user/userToSimpleUserDto"

export class FollowRepository {
  constructor(private db = dataSource) {}

  userAIsFollowingUserB(userAId: number, userBId: number) {
    return this.db.getRepository(Follow).findOne({
      where: {
        followerId: userAId,
        followedUserId: userBId,
      },
    })
  }

  followUser(followerId: number, followingUserId: number) {
    return this.db.getRepository(Follow).save({
      followerId,
      followedUserId: followingUserId,
    })
  }

  deleteFollow(followId: number) {
    return this.db.getRepository(Follow).delete({
      id: followId,
    })
  }

  async findFolloweesByFollowerId(followerId: number) {
    // PE 1/3 - todo: don't return all fields
    const follows = await this.db.getRepository(Follow).find({
      where: {
        followerId,
      },
      relations: ["followedUser", "followedUser.profile"],
    })

    return follows.map((f) => ({
      ...f,
      followedUser: userToSimpleUserDto(f.followedUser),
    }))
  }

  async findFollowers(userId: number) {
    const follows = await this.db.getRepository(Follow).find({
      where: {
        followedUserId: userId,
      },
      relations: ["follower", "follower.profile"],
      order: {
        createdAt: "DESC",
      },
    })

    return follows.map((f) => ({
      ...f,
      follower: userToSimpleUserDto(f.follower),
    }))
  }

  async findMostFollowedUsers() {
    return this.db
      .getRepository(Follow)
      .createQueryBuilder("follow")
      .select("follow.followedUserId")
      .addSelect("COUNT(follow.followedUserId)", "followedUserId")
      .groupBy("follow.followedUserId")
      .orderBy("followedUserId", "DESC")
      .getRawMany()
  }

  // async findMutuals(userId: number) {

  //   const followingUserIds = (
  //     await this.prismaClient.follow.findMany({
  //       where: {
  //         followerId: userId,
  //       },
  //       select: {
  //         followingUserId: true,
  //       },
  //     })
  //   ).map((r) => r.followingUserId)

  //   const mutualIds = (
  //     await this.prismaClient.follow.findMany({
  //       where: {
  //         followerId: {
  //           in: followingUserIds,
  //         },
  //         followingUserId: userId,
  //       },
  //     })
  //   ).map((r) => r.followerId)

  //   return this.prismaClient.user.findMany({
  //     where: {
  //       id: {
  //         in: mutualIds,
  //       },
  //     },
  //     select: userSelectFields,
  //   })
  // }
}
