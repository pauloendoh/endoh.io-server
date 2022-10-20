import {
  BadRequestError,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  Param,
} from "routing-controllers"
import { User } from "../../../entities/User"
import ProgressRepository from "../../../repositories/skillbase/ProgressRepository"

// PE 1/3 - not being used. Delete?
@JsonController("/skillbase/progress")
export class ProgressController {
  constructor(private progressRepo = ProgressRepository) {}

  @Get("/")
  async findAllSkillsFromAuthUser(
    @CurrentUser({ required: true })
    user: User
  ) {
    return this.progressRepo.getAllFromUser(user.id)
  }

  @Delete("/:id")
  async deleteProgress(
    @CurrentUser({ required: true })
    user: User,
    @Param("id") id: number
  ) {
    const result = await this.progressRepo.delete({ id, user })
    if (!result.affected)
      throw new BadRequestError("Progress not found, or user is not owner.")

    return this.progressRepo.getAllFromUser(user.id)
  }
}
