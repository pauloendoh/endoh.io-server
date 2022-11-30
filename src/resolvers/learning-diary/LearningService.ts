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

  async findAvgLearningPerHour(userId: number, clientHourOffset: number) {
    const serverHourOffset = (new Date().getTimezoneOffset() / 60) * -1
    const diffHourOffset = clientHourOffset - serverHourOffset

    const countByDay = await this.repo.getLearningCountByDay(
      userId,
      diffHourOffset
    )
    const learnings = await this.repo.findLearningsByUserIdExceptToday(
      userId,
      diffHourOffset
    )

    const hours: number[] = []
    for (let i = 1; i <= 24; i++) {
      hours.push(i)
    }

    const totalDays = countByDay.length

    const top50Index = Math.floor(totalDays / 2)
    const top50PercentDays = countByDay
      .slice(0, top50Index)
      .map((c) => c.date)
      .map((d) => d.toJSON().slice(0, 10))

    const avgLearningByHour = Promise.all(
      hours.map((hour) =>
        this.filterAvgLearningByHour(
          learnings,
          countByDay.length,
          hour,
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
    top50PercentDays: string[]
  ) {
    if (hour === 23) {
      console.log()
    }

    const filteredLearnings = allLearnings.filter((l) => {
      const dt = DateTime.fromJSDate(new Date(l.datetime))

      if (dt.hour >= hour) return false
      return true
    })

    const total = filteredLearnings.reduce((total, l) => {
      if (l.isHighlight) return total + 2
      return total + 1
    }, 0)

    const top50PercentDaysLearningCount = filteredLearnings
      .filter((l) => {
        const day = DateTime.fromJSDate(new Date(l.datetime)).toISODate()
        return top50PercentDays.includes(day)
      })
      .reduce((total, l) => {
        if (l.isHighlight) return total + 2
        return total + 1
      }, 0)

    return {
      hour,
      count: Math.floor(total / totalDays),

      top50PercentDaysLearningCount: Math.floor(
        top50PercentDaysLearningCount / top50PercentDays.length
      ),
    }
  }
}
