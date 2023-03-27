import { UserAramChampion } from "../../../entities/LolRates/UserAramChampion"
import { AramRepository } from "./AramRepository"

export class AramService {
  constructor(private aramRepository = new AramRepository()) {}

  async findAramWinRates() {
    const aramWinRates = await this.aramRepository.findAramWinRates()
    return aramWinRates
  }

  async findUserAramChampions(userId: number) {
    return this.aramRepository.findUserAramChampions(userId)
  }

  async saveUserAramChampion(userId: number, data: UserAramChampion) {
    return this.aramRepository.saveUserAramChampion(userId, data)
  }
}
