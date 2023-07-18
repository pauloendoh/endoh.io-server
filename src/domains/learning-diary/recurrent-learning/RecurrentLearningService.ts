import { UnauthorizedError } from "routing-controllers"
import { RecurrentLearningRepository } from "./RecurrentLearningRepository"
import { RecurrentLearningDto } from "./types/RecurrentLearningDto"

export class RecurrentLearningService {
  constructor(private repo = new RecurrentLearningRepository()) {}

  async save(requesterId: number, data: RecurrentLearningDto) {
    if (data.id) {
      const found = await this.repo.userOwnsRecurrentLearning({
        recurrentLearningId: data.id,
        userId: requesterId,
      })

      if (found?.userId !== requesterId) {
        throw new UnauthorizedError("Unauthorized")
      }
      return this.repo.update(data)
    }

    return this.repo.create({
      ...data,
      userId: requesterId,
    })
  }

  async delete(requesterId: number, id: number) {
    const found = await this.repo.userOwnsRecurrentLearning({
      recurrentLearningId: id,
      userId: requesterId,
    })
    if (found?.userId !== requesterId) {
      throw new UnauthorizedError("Unauthorized")
    }
    return this.repo.delete(id)
  }

  async findByUserId(userId: number) {
    return this.repo.findByUserId(userId)
  }
}
