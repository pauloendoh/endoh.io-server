import { LessThan } from "typeorm"
import { dataSource } from "../../../dataSource"
import { Learning } from "../../../entities/learning-diary/Learning"

const learningRepository = dataSource.getRepository(Learning).extend({
  async getLearningCountByDay(
    userId: number
  ): Promise<{ date: Date; learningCount: number }[]> {
    const result = await learningRepository.query(
      `
      select datetime::timestamp::date                              as "date", 
             sum(case when "isHighlight" = true then 2 else 1 end)  as "learningCount"
	      from learning l 
	     where "userId"  = $1
         and "createdAt" < current_date
    group by datetime::timestamp::date
    order by "learningCount" desc`,
      [userId]
    )

    return result
  },

  async findLearningsByUserId(userId: number) {
    return learningRepository.find({
      where: {
        userId,
      },
    })
  },

  async findLearningsByUserIdExceptToday(userId: number) {
    const currentDate = new Date().toJSON().slice(0, 10)
    return learningRepository.find({
      where: {
        userId,
        createdAt: LessThan(currentDate),
      },
    })
  },
})

export default learningRepository
