import {
  CurrentUser,
  Get,
  JsonController,
  QueryParam,
} from "routing-controllers"
import { User } from "../../../entities/User"
import LearningService from "../../../resolvers/learning-diary/LearningService"

@JsonController()
export class ProgressController {
  constructor(private learningService = new LearningService()) {}

  @Get("/avg-learning-per-hour")
  async findAvgLearningPerHour(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("hourOffset", { required: true }) hourOffset: number,
    @QueryParam("topPercent", { required: true }) topPercent: number
  ) {
    return this.learningService.findAvgLearningPerHour(
      user.id,
      hourOffset,
      topPercent
    )
  }

  @Get("/learnings-per-day")
  async findLearningsPerDay(@CurrentUser({ required: true }) user: User) {
    return this.learningService.findLearningsPerDay(user.id)
  }
}
