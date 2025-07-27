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

  async updateUserGotIt(
    userId: number,
    updateData: {
      createTag?: boolean
    }
  ) {
    const found = await this.findOrCreateUserGotIt(userId)

    return this.gotItRepo.save({
      id: found.id,
      createTag: updateData.createTag,
    })
  }
}
