"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const UserSuggestion_1 = require("../../../../entities/feed/UserSuggestion");
const FollowingTagRepository_1 = require("../../../../repositories/feed/FollowingTagRepository");
const myConsoleError_1 = require("../../../myConsoleError");
const createUserSuggestionsForUser = async (user) => {
    try {
        const followingTagRepo = typeorm_1.getCustomRepository(FollowingTagRepository_1.default);
        // clear all the recommended users from that user
        const result = await typeorm_1.getConnection()
            .createQueryBuilder()
            .delete()
            .from(UserSuggestion_1.UserSuggestion)
            .where("userId = :userId", { userId: user.id })
            .execute();
        // from users YOU FOLLOW
        const mostFollowedUsers = await followingTagRepo.getMostFollowedUsersByUsersYouFollow(user, 40);
        for (const mostFollowedUser of mostFollowedUsers) {
            await typeorm_1.getRepository(UserSuggestion_1.UserSuggestion).save({
                user: user,
                suggestedUserId: mostFollowedUser.user.userId,
                description: mostFollowedUser.count > 1 ?
                    'Followed by ' + mostFollowedUser.count + 'users you know' : "Followed by 1 user you know"
            });
        }
        // from users YOU DO NOT follow
        const mostFollowedUsers2 = await followingTagRepo.getMostFollowedUsersByUsersYouDONTFollow(user);
        for (const mostFollowedUser of mostFollowedUsers2) {
            await typeorm_1.getRepository(UserSuggestion_1.UserSuggestion).save({
                user: user,
                suggestedUserId: mostFollowedUser.user.userId,
                description: mostFollowedUser.count > 1 ?
                    'Followed by ' + mostFollowedUser.count + 'users' : "Followed by 1 user"
            });
        }
    }
    catch (e) {
        myConsoleError_1.myConsoleError("error createUserSuggestionsForUser(): " + e.message);
    }
};
exports.default = createUserSuggestionsForUser;
//# sourceMappingURL=createUserSuggestionsForUser.js.map