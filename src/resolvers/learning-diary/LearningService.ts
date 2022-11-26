import { DateTime } from "luxon"
import learningRepository from "../../domains/learning-diary/learning/learningRepository"
import { Learning } from "../../entities/learning-diary/Learning"
import LearningInput from "./types/LearningInput"

// PE 1/3 - delete?
export default class LearningService {
  constructor(private repo = learningRepository) {}

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

  async findAvgLearningPerHour(userId: number) {
    const daysCount = await this.repo.getLearningDaysCountByUserId(userId)
    const learnings = await this.repo.findLearningsByUserIdExceptToday(userId)
    console.log({ daysCount })

    const hours: number[] = []
    for (let i = 1; i <= 24; i++) {
      hours.push(i)
    }

    const avgLearningByHour = Promise.all(
      hours.map((hour) =>
        this.filterAvgLearningByHour(learnings, daysCount, hour)
      )
    )

    return avgLearningByHour
  }

  private async filterAvgLearningByHour(
    learnings: Learning[],
    daysCount: number,
    hour: number
  ) {
    if (hour === 24) {
      console.log()
    }

    const filteredLearnings = learnings.filter((l) => {
      const dt = DateTime.fromJSDate(new Date(l.datetime))

      if (dt.hour === 0 && dt.minute === 0 && dt.second === 0) return false
      if (dt.hour >= hour) return false
      return true
    })

    const total = filteredLearnings.reduce((total, l) => {
      if (l.isHighlight) return total + 2
      return total + 1
    }, 0)

    return {
      hour,
      count: Math.floor(total / daysCount),
    }
  }
}
