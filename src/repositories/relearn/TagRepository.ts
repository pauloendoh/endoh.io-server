import { dataSource } from "../../dataSource"
import { Tag } from "../../entities/relearn/Tag"
import { User } from "../../entities/User"

export const getTagRepository = () => TagRepository

export const TagRepository = dataSource.getRepository(Tag).extend({
  // PE 2/3 - rename to findAllTagsFromUser
  async getAllTagsFromUser(user: User): Promise<Tag[]> {
    return TagRepository.createQueryBuilder("tag")
      .where({ user })
      .leftJoinAndSelect("tag.resources", "resources")
      .orderBy("tag.createdAt", "ASC")
      .getMany()
  },

  async getFullTagFromUser(tagId: number, userId: number) {
    return TagRepository.createQueryBuilder("tag")
      .where({ id: tagId, userId })
      .leftJoinAndSelect("tag.resources", "resources")
      .orderBy("tag.createdAt", "ASC")
      .getOne()
  },

  async createExampleTag(user: User): Promise<Tag[]> {
    const exampleTag1 = await TagRepository.save({
      user,
      name: "General",
      color: "#14aaf5",
    })

    return [exampleTag1]
  },

  findPublicTags() {
    return TagRepository.find({
      where: {
        isPrivate: !false,
      },
    })
  },
})

export default TagRepository
