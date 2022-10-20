import { In, Not } from "typeorm"
import { dataSource } from "../../dataSource"
import { Profile } from "../../entities/feed/Profile"
import { User } from "../../entities/User"
import UserRepository from "../../repositories/UserRepository"
import { myConsoleError } from "../myConsoleError"
import { myConsoleSuccess } from "../myConsoleSuccess"

export const createProfileForUsers = async () => {
  try {
    const userRepo = UserRepository
    const profile = dataSource.getRepository(Profile)

    const preferences = await profile.find({ relations: ["user"] })
    const userIds = preferences.map((p) => p.user.id)

    let usersNoProfiles: User[]

    if (userIds.length) {
      usersNoProfiles = await userRepo.find({
        where: {
          id: Not(In([...userIds])),
        },
      })
    } else usersNoProfiles = await userRepo.find()

    for (const user of usersNoProfiles) {
      await profile.save({
        userId: user.id,
        fullName: user.username,
      })
    }

    myConsoleSuccess("usersNoProfiles: " + usersNoProfiles.length)
  } catch (e) {
    myConsoleError(e.message)
  }
}
