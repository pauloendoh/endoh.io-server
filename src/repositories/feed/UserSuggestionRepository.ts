import { EntityRepository, getCustomRepository, Repository } from "typeorm"
import { UserSuggestionDto } from "../../dtos/feed/UserSuggestionDto"
import { UserSuggestion } from "../../entities/feed/UserSuggestion"
import { User } from "../../entities/User"
import { myConsoleError } from "../../utils/myConsoleError"
import FollowingTagRepository from "./FollowingTagRepository"

@EntityRepository(UserSuggestion)
export default class UserSuggestionRepository extends Repository<
  UserSuggestion
> {
  async getUserSuggestions(forUser: User): Promise<UserSuggestionDto[]> {
    return this.query(
      `
        	select sug."id",
          		   sug."suggestedUserId",
          		   sug."description", 
          		   usu."username",
          		   pro."fullName",
          		   pro."pictureUrl"
        	  from "user_suggestion" 	sug 
      inner join "user" 				    usu on usu.id = sug."suggestedUserId"
      inner join "profile"			    pro on pro."userId" = usu."id"
           where sug."userId" = $1
        order by sug."id"`,
      [forUser.id]
    )
  }

  createUserSuggestionsForUser = async (user: User) => {
    try {
      const followingTagRepo = getCustomRepository(FollowingTagRepository)

      // clear all the recommended users from that user
      const result = await this.createQueryBuilder()
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
        await this.save({
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
        await this.save({
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
}
