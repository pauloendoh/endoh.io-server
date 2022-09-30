import { EntityRepository, getCustomRepository, Repository } from "typeorm";
import { Doc } from "../../entities/define/Doc";
import { User } from "../../entities/User";

export const getDocRepository = () => getCustomRepository(DocRepository);

@EntityRepository(Doc)
export default class DocRepository extends Repository<Doc> {
  async getAllDocsFromUserId(userId: number): Promise<Doc[]> {
    return this.createQueryBuilder("doc")
      .where({ userId })
      .orderBy("doc.title", "ASC")
      .getMany();
  }

  async createDocForNewUser(user: User): Promise<Doc> {
    return this.save({ user, title: "[Example] The Little Prince" });
  }

  async userOwnsDoc(userId: number, docId: number) {
    const found = await this.findOne({
      where: {
        userId,
        id: docId,
      },
    });

    return !!found;
  }

  async deleteDoc(docId: number) {
    return this.delete({ id: docId });
  }
}
