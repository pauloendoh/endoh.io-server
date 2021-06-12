import { EntityRepository, Repository } from "typeorm"
import { Doc } from "../../entities/define/Doc"

@EntityRepository(Doc)
export default class DocRepository extends Repository<Doc> {
  async getAllDocsFromUserId(userId: number): Promise<Doc[]> {
    return this.createQueryBuilder("doc")
      .where({ userId })
      .orderBy("doc.title", "ASC")
      .getMany()
  }
}
