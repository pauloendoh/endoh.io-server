import { Get, JsonController } from "routing-controllers"
import LolRateRepository from "../../../repositories/lolrates/LolRateRepository"

@JsonController()
export class DocController {
  constructor(private lolRateRepo = LolRateRepository) {}

  @Get("/lolRates")
  async getDocs() {
    const allWinrates = await this.lolRateRepo.findWinrates()
    const updatedAt = await this.lolRateRepo.getUpdatedAt()

    return { rates: allWinrates, updatedAt: updatedAt[0] }
  }
}
