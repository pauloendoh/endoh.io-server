"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const UserSuggestion_1 = require("../../../../entities/feed/UserSuggestion");
const FollowingTagRepository_1 = require("../../../../repositories/feed/FollowingTagRepository");
const myConsoleError_1 = require("../../../myConsoleError");
const createUserSuggestionsForUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followingTagRepo = typeorm_1.getCustomRepository(FollowingTagRepository_1.default);
        // clear all the recommended users from that user
        const result = yield typeorm_1.getConnection()
            .createQueryBuilder()
            .delete()
            .from(UserSuggestion_1.UserSuggestion)
            .where("userId = :userId", { userId: user.id })
            .execute();
        console.log(result);
        // from users YOU FOLLOW
        const mostFollowedUsers = yield followingTagRepo.getMostFollowedUsersByUsersYouFollow(user, 40);
        for (const mostFollowedUser of mostFollowedUsers) {
            yield typeorm_1.getRepository(UserSuggestion_1.UserSuggestion).save({
                user: user,
                suggestedUserId: mostFollowedUser.user.userId,
                description: mostFollowedUser.count > 1 ?
                    'Followed by ' + mostFollowedUser.count + 'users you know' : "Followed by 1 user you know"
            });
        }
        // from users YOU DO NOT follow
        const mostFollowedUsers2 = yield followingTagRepo.getMostFollowedUsersByUsersYouDONTFollow(user);
        for (const mostFollowedUser of mostFollowedUsers2) {
            yield typeorm_1.getRepository(UserSuggestion_1.UserSuggestion).save({
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
});
exports.default = createUserSuggestionsForUser;
//# sourceMappingURL=createUserSuggestionsForUser.js.map