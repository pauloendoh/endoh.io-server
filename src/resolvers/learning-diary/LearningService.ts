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
    const countByDay = await this.repo.getLearningCountByDay(userId)
    const learnings = await this.repo.findLearningsByUserIdExceptToday(userId)

    const hours: number[] = []
    for (let i = 1; i <= 24; i++) {
      hours.push(i)
    }

    const totalDays = countByDay.length
    const top25Index = Math.floor(totalDays / 4)
    const top25PercentDays = countByDay.slice(0, top25Index).map((c) => c.date)
    const top50Index = Math.floor(totalDays / 2)
    const top50PercentDays = countByDay.slice(0, top50Index).map((c) => c.date)

    const avgLearningByHour = Promise.all(
      hours.map((hour) =>
        this.filterAvgLearningByHour(
          learnings,
          countByDay.length,
          hour,
          top25PercentDays,
          top50PercentDays
        )
      )
    )

    return avgLearningByHour
  }

  private async filterAvgLearningByHour(
    allLearnings: Learning[],
    totalDays: number,
    hour: number,
    top25PercentDays: Date[],
    top50PercentDays: Date[]
  ) {
    const top25PercentDaysAsString = top25PercentDays.map((d) =>
      d.toJSON().slice(0, 10)
    )

    const top50PercentDaysAsString = top50PercentDays.map((d) =>
      d.toJSON().slice(0, 10)
    )

    if (hour === 24) {
      console.log()
    }

    const filteredLearnings = allLearnings.filter((l) => {
      const dt = DateTime.fromJSDate(new Date(l.datetime))

      if (dt.hour === 0 && dt.minute === 0 && dt.second === 0) return false
      if (dt.hour >= hour) return false
      return true
    })

    const total = filteredLearnings.reduce((total, l) => {
      if (l.isHighlight) return total + 2
      return total + 1
    }, 0)

    const top25PercentDaysLearningCount = filteredLearnings
      .filter((l) => {
        const day = DateTime.fromJSDate(new Date(l.datetime)).toISODate()
        return top25PercentDaysAsString.includes(day)
      })
      .reduce((total, l) => {
        if (l.isHighlight) return total + 2
        return total + 1
      }, 0)

    const top50PercentDaysLearningCount = filteredLearnings
      .filter((l) => {
        const day = DateTime.fromJSDate(new Date(l.datetime)).toISODate()
        return top50PercentDaysAsString.includes(day)
      })
      .reduce((total, l) => {
        if (l.isHighlight) return total + 2
        return total + 1
      }, 0)

    return {
      hour,
      count: Math.floor(total / totalDays),
      top25PercentDaysLearningCount:
        top25PercentDaysLearningCount / top25PercentDays.length,
      top50PercentDaysLearningCount:
        top50PercentDaysLearningCount / top50PercentDays.length,
    }
  }
}
