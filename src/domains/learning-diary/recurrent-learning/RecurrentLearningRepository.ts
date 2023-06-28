import { dataSource } from "../../../dataSource"
import { RecurrentLearning } from "../../../entities/learning-diary/RecurrentLearning"
import { RecurrentLearningDto } from "./types/RecurrentLearningDto"

export class RecurrentLearningRepository {
  constructor(private db = dataSource) {}

  async create(data: RecurrentLearningDto) {
    return this.db.getRepository(RecurrentLearning).save(data)
  }

  async update(data: RecurrentLearningDto) {
    return this.db.getRepository(RecurrentLearning).save(data)
  }

  async delete(id: number) {
    return this.db.getRepository(RecurrentLearning).delete(id)
  }

  async userOwnsRecurrentLearning(params: {
    userId: number
    recurrentLearningId: number
  }) {
    const { userId, recurrentLearningId } = params
    return this.db.getRepository(RecurrentLearning).findOne({
      where: {
        id: recurrentLearningId,
        userId,
      },
    })
  }

  async findByUserId(userId: number) {
    return this.db.getRepository(RecurrentLearning).find({
      where: {
        userId,
      },
    })
  }
}
