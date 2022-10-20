import { In, Not } from "typeorm"
import { dataSource } from "../../dataSource"
import { User } from "../../entities/User"
import { UserPreference } from "../../entities/UserPreference"
import UserRepository from "../../repositories/UserRepository"
import { myConsoleError } from "../myConsoleError"
import { myConsoleSuccess } from "../myConsoleSuccess"

export const createPreferencesForAll = async () => {
  try {
    const userRepo = UserRepository
    const preferenceRepo = dataSource.getRepository(UserPreference)

    const preferences = await preferenceRepo.find({ relations: ["user"] })
    const userIds = preferences.map((p) => p.user.id)

    let usersNoPreference: User[]

    if (userIds.length) {
      usersNoPreference = await userRepo.find({
        where: {
          id: Not(In([...userIds])),
        },
      })
    } else usersNoPreference = await userRepo.find()

    for (const user of usersNoPreference) {
      await preferenceRepo.save({
        user: user,
      })
    }

    myConsoleSuccess("usersNoPreference: " + usersNoPreference.length)
  } catch (e) {
    myConsoleError(e.message)
  }
}
