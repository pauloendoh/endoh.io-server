import { dataSource } from "../../../dataSource"
import { Learning } from "../../../entities/learning-diary/Learning"

const learningRepository = dataSource.getRepository(Learning).extend({
  async getLearningCountByDay(
    userId: number,
    hourOffset: number
  ): Promise<{ date: Date; learningCount: number }[]> {
    const result = await learningRepository.query(
      `
      select datetime::timestamp::date                              as "date", 
             sum(case when "isHighlight" = true then 2 else 1 end)  as "learningCount"
	      from learning l 
	     where "userId"  = $1
         and ("datetime" + interval '${hourOffset}' hour) < current_date
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

  async findLearningsByUserIdExceptToday(userId: number, hourOffset: number) {
    return learningRepository.query(
      `
      select ("datetime" + interval '${hourOffset}' hour) as "datetime", 
        "isHighlight"
       from learning l 
      where ("datetime" + interval '${hourOffset}' hour) < current_date
      and "userId" = $1
      
   `,
      [userId]
    )
  },
})

export default learningRepository
