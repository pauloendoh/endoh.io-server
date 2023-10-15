import { In, Not } from "typeorm"
import { dataSource } from "../../../dataSource"
import { LastSeenResource } from "../../../entities/feed/LastSeenResource"
import { Resource } from "../../../entities/relearn/Resource"
import { Tag } from "../../../entities/relearn/Tag"
import { userToSimpleUserDto } from "../../../utils/domain/user/userToSimpleUserDto"

export class FeedRepository {
  constructor(private db = dataSource) {}

  async findPublicTagsFromUserIds(userIds: number[]) {
    return this.db.getRepository(Tag).find({
      where: {
        userId: In(userIds),
        isPrivate: false,
      },
    })
  }

  async findAllTagsFromUserIds(userIds: number[]) {
    return this.db.getRepository(Tag).find({
      where: {
        userId: In(userIds),
      },
    })
  }

  async findCompletedResourcesByTagIds(tagIds: number[]) {
    const resources = await this.db.getRepository(Resource).find({
      where: {
        tagId: In(tagIds),
        url: Not(""),
        completedAt: Not(""),
      },
      relations: ["tag", "user", "user.profile"],
      order: {
        completedAt: "DESC",
      },
    })

    return resources.map((r) => ({
      ...r,
      user: userToSimpleUserDto(r.user),
    }))
  }

  async findBookmarkedResourcesByTagIds(tagIds: number[]) {
    const resources = await this.db.getRepository(Resource).find({
      where: {
        tagId: In(tagIds),
        url: Not(""),
        completedAt: "",
      },
      relations: ["tag", "user", "user.profile"],
      order: {
        createdAt: "DESC",
      },
    })

    return resources.map((r) => ({
      ...r,
      user: userToSimpleUserDto(r.user),
    }))
  }

  async updateLastSeenResource(params: { userId: number; lastSeenAt: string }) {
    return this.db.getRepository(LastSeenResource).upsert(
      {
        lastSeenAt: params.lastSeenAt,
        userId: params.userId,
      },
      ["userId"]
    )
  }

  async getLastSeenResource(userId: number) {
    return this.db.getRepository(LastSeenResource).findOne({
      where: {
        userId,
      },
    })
  }
}
