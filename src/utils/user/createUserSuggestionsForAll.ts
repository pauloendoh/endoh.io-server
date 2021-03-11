import { FollowingUserDto } from '../../dtos/feed/FollowingUserDto';
import { getConnection, getCustomRepository, getRepository, In, Not } from 'typeorm'
import { Profile } from '../../entities/feed/Profile'
import { UserSuggestion } from '../../entities/feed/UserSuggestion'
import { User } from '../../entities/User'
import { UserPreference } from '../../entities/UserPreference'
import FollowingTagRepository from '../../repositories/feed/FollowingTagRepository'
import UserRepository from '../../repositories/UserRepository'
import { myConsoleError } from '../myConsoleError'
import { myConsoleSuccess } from '../myConsoleSuccess'

export const createUserSuggestionsForAll = async () => {
    try {
        const followingTagRepo = getCustomRepository(FollowingTagRepository)

        // for each user
        const allUsers = await getRepository(User).find()
        for (const user of allUsers) {

            // clear all the recommended users from that user
            const result = await getConnection()
                .createQueryBuilder()
                .delete()
                .from(UserSuggestion)
                .where("userId = :userId", { userId: user.id })
                .execute()
            console.log(result)

            // from users YOU FOLLOW
            const mostFollowedUsers =
                await followingTagRepo.getMostFollowedUsersByUsersYouFollow(user, 40)

            for (const mostFollowedUser of mostFollowedUsers) {
                await getRepository(UserSuggestion).save({
                    user: user,
                    suggestedUserId: mostFollowedUser.user.userId,
                    description: mostFollowedUser.count > 1 ?
                        'Followed by ' + mostFollowedUser.count + 'users you know' : "Followed by 1 user you know"
                })
            }

            // from users YOU DO NOT follow
            const mostFollowedUsers2 =
                await followingTagRepo.getMostFollowedUsersByUsersYouDONTFollow(user)

            for (const mostFollowedUser of mostFollowedUsers2) {
                await getRepository(UserSuggestion).save({
                    user: user,
                    suggestedUserId: mostFollowedUser.user.userId,
                    description: mostFollowedUser.count > 1 ?
                        'Followed by ' + mostFollowedUser.count + 'users' : "Followed by 1 user"
                })
            }
        }



    } catch (e) {
        myConsoleError(e.message)
    }
}  