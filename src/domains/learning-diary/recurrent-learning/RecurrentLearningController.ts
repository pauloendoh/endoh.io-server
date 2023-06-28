import {
  Body,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Post,
  QueryParam,
} from "routing-controllers"
import { User } from "../../../entities/User"
import { RecurrentLearningService } from "./RecurrentLearningService"
import { RecurrentLearningDto } from "./types/RecurrentLearningDto"

@JsonController()
export class RecurrentLearningController {
  constructor(private service = new RecurrentLearningService()) {}

  @Get("/recurrent-learnings")
  async findRecurrentLearnings(@CurrentUser({ required: true }) user: User) {
    return this.service.findByUserId(user.id)
  }

  @Post("/recurrent-learnings")
  async saveRecurrentLearning(
    @CurrentUser({ required: true }) user: User,
    @Body() body: RecurrentLearningDto
  ) {
    return this.service.save(user.id, body)
  }

  @Delete("/recurrent-learnings")
  async deleteRecurrentLearning(
    @CurrentUser({ required: true }) user: User,
    @QueryParam("id", { required: true }) id: number
  ) {
    return this.service.delete(user.id, id)
  }
}
