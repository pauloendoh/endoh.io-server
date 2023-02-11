import { dataSource } from "../../dataSource"
import { Doc } from "../../entities/define/Doc"
import { User } from "../../entities/User"

export const getDocRepository = () => DocRepository

const DocRepository = dataSource.getRepository(Doc).extend({
  async getAllDocsFromUserId(userId: number): Promise<Doc[]> {
    return this.createQueryBuilder("doc")
      .where({ userId })
      .orderBy("doc.title", "ASC")
      .getMany()
  },

  async createDocForNewUser(user: User): Promise<Doc> {
    return this.save({ user, title: "[Example] The Little Prince" })
  },

  async userOwnsDoc(userId: number, docId: number) {
    const found = await this.findOne({
      where: {
        userId,
        id: docId,
      },
    })

    return !!found
  },

  async deleteDoc(docId: number) {
    return this.delete({ id: docId })
  },

  async searchDocs(text: string, userId: number) {
    const words = text.split(" ")

    let query = DocRepository.createQueryBuilder("doc").where({ userId })

    // multi word search
    words.forEach((word, index) => {
      // https://github.com/typeorm/typeorm/issues/3119
      query = query.andWhere(
        `(unaccent(doc.title) ilike unaccent(:text${index}))`,
        {
          [`text${index}`]: `%${word}%`,
        }
      )
    })

    query = query.orderBy('doc."updatedAt"', "DESC")

    return query.getMany()
  },
})

export default DocRepository
