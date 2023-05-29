import { In, IsNull, Not } from "typeorm"
import { dataSource } from "../../../dataSource"
import { Resource } from "../../../entities/relearn/Resource"
import { Tag } from "../../../entities/relearn/Tag"
import { clearUserFields } from "../../../utils/domain/user/clearUserFields"

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

  async findResourcesByTagIds(tagIds: number[]) {
    const resources = await this.db.getRepository(Resource).find({
      where: {
        tagId: In(tagIds),
        completedAt: Not(IsNull()),
        rating: Not(IsNull()),
      },
      relations: ["tag", "user", "user.profile"],
      order: {
        completedAt: "DESC",
      },
    })

    return resources.map((r) => ({
      ...r,
      user: clearUserFields(r.user),
    }))
  }
}
