import { MalUser } from "../../../entities/MAL/MalUser"
import { MalRepository } from "./MalRepository"

export class MalService {
  constructor(private repo = new MalRepository()) {}

  async saveMalUser(userId: number, dto: MalUser) {
    if (dto.id) {
      return this.repo.updateMalUser(userId, dto)
    }

    return this.repo.createMalUser(userId, dto)
  }

  async findMalUser(userId: number) {
    const malUser = await this.repo.findMalUser(userId)
    if (malUser) return malUser

    const newMalUser = new MalUser()
    newMalUser.userId = userId
    return this.repo.createMalUser(userId, newMalUser)
  }

  async findMalSimilarities(userId: number) {
    const malUser = await this.findMalUser(userId)
    if (!malUser) return []

    return this.repo.findMalSimilarities(malUser.username)
  }

  async toggleMalSimilarityCheck(id: number) {
    return this.repo.toggleMalSimilarityCheck(id)
  }
}
