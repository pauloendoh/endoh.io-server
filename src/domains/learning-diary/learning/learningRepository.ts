import { dataSource } from "../../../dataSource"
import { Learning } from "../../../entities/learning-diary/Learning"

const learningRepository = dataSource.getRepository(Learning).extend({
  async getLearningDaysCountByUserId(userId: number) {
    const result = await learningRepository.query(
      `
      select count(distinct datetime::timestamp::date) 
	      from learning l 
	    where "userId"  = $1`,
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
})

export default learningRepository
