import { getCustomRepository, getRepository, In, Not } from 'typeorm'
import { UserPreference } from '../../entities/UserPreference'
import UserRepository from '../../repositories/UserRepository'
import { myConsoleError } from '../myConsoleError'
import { myConsoleSuccess } from '../myConsoleSuccess'

export const createPreferencesForAll = async () => {
    try {
        const userRepo = getCustomRepository(UserRepository)
        const preferenceRepo = getRepository(UserPreference)

        const preferences = await preferenceRepo.find(
            { relations: ['user'] }
        )
        const userIds = preferences.map(p => p.user.id)
        
        const usersNoPreference = await userRepo
            .find({ id: Not(In([...userIds])) })

        for (const user of usersNoPreference) {
            await preferenceRepo.save({
                user: user
            })
        }

        myConsoleSuccess("usersNoPreference: " + usersNoPreference.length)
    } catch (e) {
        myConsoleError(e.message)
    }
}  