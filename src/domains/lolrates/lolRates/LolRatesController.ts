import { CurrentUser, Get, JsonController } from "routing-controllers"
import { User } from "../../../entities/User"
import LolRateRepository from "../../../repositories/lolrates/LolRateRepository"

@JsonController()
export class DocController {
  constructor(private lolRateRepo = LolRateRepository) {}

  @Get("/lolRates")
  async getDocs(@CurrentUser({ required: true }) user: User) {
    const allWinrates = await this.lolRateRepo.findWinrates()
    const updatedAt = await this.lolRateRepo.getUpdatedAt()

    return { rates: allWinrates, updatedAt: updatedAt[0] }
  }
}
