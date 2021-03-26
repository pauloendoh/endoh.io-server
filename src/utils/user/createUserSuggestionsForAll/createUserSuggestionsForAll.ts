import { getRepository } from 'typeorm';
import { User } from '../../../entities/User';
import { myConsoleError } from '../../myConsoleError';
import { myConsoleSuccess } from '../../myConsoleSuccess';
import createUserSuggestionsForUser from './createUserSuggestionsForUser/createUserSuggestionsForUser';

export const createUserSuggestionsForAll = async () => {
    try {
        myConsoleSuccess("running createUserSuggestionsForAll()")

        // for each user
        const allUsers = await getRepository(User).find()
        for (const user of allUsers) {
            createUserSuggestionsForUser(user)
        }
        myConsoleSuccess("success createUserSuggestionsForAll()")



    } catch (e) {
        myConsoleError("error createUserSuggestionsForAll(): " + e.message)

    }
}