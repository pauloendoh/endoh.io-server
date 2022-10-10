import {
  CurrentUser,
  Get,
  JsonController,
  QueryParam,
} from "routing-controllers"
import { User } from "../../../entities/User"
import SkillHistoryService from "../../../services/SkillHistoryService"

@JsonController()
export class SkillProgressController {
  constructor(private skillHistoryService = new SkillHistoryService()) {}

  @Get("/v2/skillbase/skill-progress")
  async getSkillProgresses(
    @CurrentUser() user: User,
    @QueryParam("from", { required: true }) fromYearMonth: string
  ) {
    if (fromYearMonth?.length !== 10) return []

    return this.skillHistoryService.findProgressFrom(user.id, fromYearMonth)
  }

  @Get("/v2/skillbase/skill-progress/months")
  async getMonths(@CurrentUser() user: User) {
    return this.skillHistoryService.findHistoryMonthsFromUser(user.id)
  }
}
