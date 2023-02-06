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

  async findAvgLearningPerHour(
    userId: number,
    clientHourOffset: number,
    topPercent = 0
  ) {
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

    const topIndex = Math.floor(totalDays / (100 / topPercent))
    const topPercentDays = countByDay
      .slice(0, topIndex)
      .map((c) => c.date)
      .map((d) => d.toJSON().slice(0, 10))

    const avgLearningByHour = Promise.all(
      hours.map((hour) =>
        this.filterAvgLearningByHour(
          learnings,
          countByDay.length,
          hour,
          topPercentDays
        )
      )
    )

    return avgLearningByHour
  }

  private async filterAvgLearningByHour(
    allLearnings: Learning[],
    totalDays: number,
    hour: number,
    topPercentDays: string[]
  ) {
    if (hour === 23) {
      console.log()
    }

    const filteredLearnings = allLearnings.filter((l) => {
      const dt = DateTime.fromJSDate(new Date(l.datetime))

      if (dt.hour === 0 && dt.minute === 0 && dt.second === 0) return false

      if (dt.hour >= hour) return false
      return true
    })

    const total = filteredLearnings.reduce((total, l) => {
      return total + l.points
    }, 0)

    const topPercentDaysLearningCount = filteredLearnings
      .filter((l) => {
        const day = DateTime.fromJSDate(new Date(l.datetime)).toISODate()
        return topPercentDays.includes(day)
      })
      .reduce((total, l) => {
        return total + l.points
      }, 0)

    return {
      hour,
      count: Math.floor(total / totalDays),

      topPercentDaysLearningCount: Math.floor(
        topPercentDaysLearningCount / topPercentDays.length
      ),
    }
  }

  async findLearningsPerDay(userId: number) {
    const countByDay = await this.repo.getLearningCountByDay(userId, 0)

    return countByDay
      .filter(
        // should not include today
        (c) => c.date.toJSON().slice(0, 10) !== new Date().toJSON().slice(0, 10)
      )
      .sort(
        (a, b) =>
          // date desc
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
  }
}
