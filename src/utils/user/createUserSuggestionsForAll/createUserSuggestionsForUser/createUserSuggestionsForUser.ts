import { getConnection, getCustomRepository, getRepository } from "typeorm"
import { UserSuggestion } from "../../../../entities/feed/UserSuggestion"
import { User } from "../../../../entities/User"
import FollowingTagRepository from "../../../../repositories/feed/FollowingTagRepository"
import { myConsoleError } from "../../../myConsoleError"

const createUserSuggestionsForUser = async (user: User) => {
  try {
    const followingTagRepo = getCustomRepository(FollowingTagRepository)

    // clear all the recommended users from that user
    const result = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(UserSuggestion)
      .where("userId = :userId", { userId: user.id })
      .execute()

    // from users YOU FOLLOW
    const mostFollowedUsers = await followingTagRepo.getMostFollowedUsersByUsersYouFollow(
      user,
      40
    )

    for (const mostFollowedUser of mostFollowedUsers) {
      await getRepository(UserSuggestion).save({
        user: user,
        suggestedUserId: mostFollowedUser.user.userId,
        description:
          mostFollowedUser.count > 1
            ? "Followed by " + mostFollowedUser.count + " users you know"
            : "Followed by 1 user you know",
      })
    }

    // from users YOU DO NOT follow
    const mostFollowedUsers2 = await followingTagRepo.getMostFollowedUsersByUsersYouDONTFollow(
      user
    )

    for (const mostFollowedUser of mostFollowedUsers2) {
      await getRepository(UserSuggestion).save({
        user: user,
        suggestedUserId: mostFollowedUser.user.userId,
        description:
          mostFollowedUser.count > 1
            ? "Followed by " + mostFollowedUser.count + " users"
            : "Followed by 1 user",
      })
    }
  } catch (e) {
    myConsoleError("error createUserSuggestionsForUser(): " + e.message)
  }
}

export default createUserSuggestionsForUser
