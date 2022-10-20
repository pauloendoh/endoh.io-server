import { dataSource } from "../../dataSource"
import { Learning } from "../../entities/learning-diary/Learning"
import LearningInput from "./types/LearningInput"

// PE 1/3 - delete?
export default class LearningService {
  constructor(private repo = dataSource.getRepository(Learning)) {}

  findLearningsByUser = async (userId: number) => {
    return await this.repo.find({
      where: {
        userId,
      },
    })
  }

  addLearning = async (data: LearningInput, userId: number) => {
    return await this.repo.save({ ...data, userId })
  }

  updateLearning = async (data: LearningInput, userId: number) => {
    const found = await this.repo.findOne({
      where: {
        id: data.id,
        userId,
      },
    })
    if (!found) throw new Error("Not allowed.")

    return await this.repo.save({ ...found, ...data })
  }
}
