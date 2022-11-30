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
    @QueryParam("hourOffset", { required: true }) hourOffset: number
  ) {
    return this.learningService.findAvgLearningPerHour(user.id, hourOffset)
  }
}
