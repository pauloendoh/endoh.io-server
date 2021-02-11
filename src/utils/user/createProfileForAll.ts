import { getCustomRepository, getRepository, In, Not } from 'typeorm'
import { Profile } from '../../entities/feed/Profile'
import { User } from '../../entities/User'
import { UserPreference } from '../../entities/UserPreference'
import UserRepository from '../../repositories/UserRepository'
import { myConsoleError } from '../myConsoleError'
import { myConsoleSuccess } from '../myConsoleSuccess'

export const createProfileForUsers = async () => {
    try {
        const userRepo = getCustomRepository(UserRepository)
        const profile = getRepository(Profile)

        const preferences = await profile.find(
            { relations: ['user'] }
        )
        const userIds = preferences.map(p => p.user.id)

        let usersNoProfiles:  User[]

        if (userIds.length) {
            usersNoProfiles = await userRepo
                .find({ id: Not(In([...userIds])) })
        }

        else usersNoProfiles = await userRepo.find()

        for (const user of usersNoProfiles) {
            await profile.save({
                user: user
            })
        }

        myConsoleSuccess("usersNoProfiles: " + usersNoProfiles.length)
    } catch (e) {
        myConsoleError(e.message)
    }
}  