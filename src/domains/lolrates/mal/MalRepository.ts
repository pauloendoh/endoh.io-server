import { IsNull, Not } from "typeorm"
import { dataSource } from "../../../dataSource"
import { MalUser } from "../../../entities/MAL/MalUser"
import { MalUserSimilarity } from "../../../entities/MAL/MalUserSimilarity"

export class MalRepository {
  constructor(private db = dataSource) {}

  async createMalUser(
    userId: number,

    dto: MalUser
  ) {
    return this.db.getRepository(MalUser).save({
      userId,
      username: dto.username,
      password: dto.password,
    })
  }

  async updateMalUser(userId: number, dto: MalUser) {
    return this.db.getRepository(MalUser).save({
      id: dto.id,
      userId,
      username: dto.username,
      password: dto.password,
    })
  }

  async findMalUser(userId: number) {
    return this.db.getRepository(MalUser).findOne({
      where: {
        userId,
      },
    })
  }

  async findMalSimilarities(usernameA: string) {
    return this.db.getRepository(MalUserSimilarity).find({
      where: {
        usernameA,
        lastScraped: Not(IsNull()),
      },
    })
  }

  async toggleMalSimilarityCheck(id: number) {
    const malUserSimilarity = await this.db
      .getRepository(MalUserSimilarity)
      .findOne({
        where: {
          id,
        },
      })
    if (!malUserSimilarity) {
      return
    }
    malUserSimilarity.checked = !malUserSimilarity.checked
    return this.db.getRepository(MalUserSimilarity).save(malUserSimilarity)
  }

  async updateErrorMalSimilarity(id: number) {
    const malUserSimilarity = await this.db
      .getRepository(MalUserSimilarity)
      .findOne({
        where: {
          id,
        },
      })
    if (!malUserSimilarity) {
      return
    }
    malUserSimilarity.lastErrorAt = new Date().toISOString()
    return this.db.getRepository(MalUserSimilarity).save(malUserSimilarity)
  }
}
