import { UserGotIt } from "../../entities/UserGotIt"
import { gotItRepository } from "./gotItRepository"

export class GotItService {
  constructor(private gotItRepo = gotItRepository) {}

  async findOrCreateUserGotIt(userId: number) {
    const gotIt = await this.gotItRepo.findOne({
      where: {
        userId,
      },
    })

    if (!gotIt) return this.createUserGotIt(userId)

    return gotIt
  }

  async createUserGotIt(userId: number) {
    return this.gotItRepo.save({ userId })
  }

  async updateUserGotIt(dto: UserGotIt, userId: number) {
    dto.userId = userId

    return this.gotItRepo.save(dto)
  }
}
