import { LessThan } from "typeorm"
import { dataSource } from "../../../dataSource"
import { Learning } from "../../../entities/learning-diary/Learning"

const learningRepository = dataSource.getRepository(Learning).extend({
  async getLearningDaysCountByUserId(userId: number) {
    const result = await learningRepository.query(
      `
      select count(distinct datetime::timestamp::date) 
	      from learning l 
	    where "userId"  = $1 
        and "createdAt" < current_date`,
      [userId]
    )

    return Number(result[0]["count"])
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
