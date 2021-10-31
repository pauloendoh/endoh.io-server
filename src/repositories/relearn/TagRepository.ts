import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Tag } from "../../entities/relearn/Tag";
import { User } from "../../entities/User";

export const getTagRepository = () => getCustomRepository(TagRepository);

@EntityRepository(Tag)
export default class TagRepository extends Repository<Tag> {
  // PE 2/3 - rename to findAllTagsFromUser
  async getAllTagsFromUser(user: User): Promise<Tag[]> {
    return this.createQueryBuilder("tag")
      .where({ user })
      .leftJoinAndSelect("tag.resources", "resources")
      .orderBy("tag.createdAt", "ASC")
      .getMany();
  }

  async getFullTagFromUser(tagId: number, userId: number) {
    return this.createQueryBuilder("tag")
      .where({ id: tagId, userId })
      .leftJoinAndSelect("tag.resources", "resources")
      .orderBy("tag.createdAt", "ASC")
      .getOne();
  }

  async createExampleTagsForNewUser(user: User): Promise<Tag[]> {
    const exampleTag1 = await this.save({
      user,
      name: "[Example] Programming",
      color: "#14aaf5",
    });

    const exampleTag2 = await this.save({
      user,
      name: "[Example] Soft Skills",
      color: "#6accbc",
      isPrivate: true,
    });

    return [exampleTag1, exampleTag2];
  }
}
