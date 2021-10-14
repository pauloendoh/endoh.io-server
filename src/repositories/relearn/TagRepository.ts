import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Tag } from "../../entities/relearn/Tag";
import { User } from "../../entities/User";

export const getTagRepository = () => getCustomRepository(TagRepository);

@EntityRepository(Tag)
export default class TagRepository extends Repository<Tag> {
  // PE 2/3
  async getAllTagsFromUser(user: User): Promise<Tag[]> {
    return this.createQueryBuilder("tag")
      .where({ user })
      .leftJoinAndSelect("tag.resources", "resources")
      .orderBy("tag.createdAt", "ASC")
      .getMany();
  }

  async createTagsForNewUser(user: User): Promise<Tag[]> {
    const tag1 = await this.save({
      user,
      name: "[Example] Programming",
      color: "#14aaf5",
    });

    const tag2 = await this.save({
      user,
      name: "[Example] Soft Skills",
      color: "#6accbc",
      isPrivate: true,
    });

    return [tag1, tag2];
  }
}
