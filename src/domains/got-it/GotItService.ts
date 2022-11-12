import { UserGotIt } from "../../entities/UserGotIt"
import { gotItRepository2 } from "./gotItRepository2"

export class GotItService {
  constructor(private gotItRepo = gotItRepository2) {}

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
