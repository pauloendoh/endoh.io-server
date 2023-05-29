import { In, IsNull, Not } from "typeorm"
import { dataSource } from "../../../dataSource"
import { Resource } from "../../../entities/relearn/Resource"
import { Tag } from "../../../entities/relearn/Tag"

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
    return this.db.getRepository(Resource).find({
      where: {
        tagId: In(tagIds),
        completedAt: Not(IsNull()),
        rating: Not(IsNull()),
      },
      relations: ["tag", "user"],
      order: {
        completedAt: "DESC",
      },
    })
  }
}
