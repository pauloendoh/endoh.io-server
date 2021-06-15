"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const UserSuggestion_1 = require("../../entities/feed/UserSuggestion");
const myConsoleError_1 = require("../../utils/myConsoleError");
const FollowingTagRepository_1 = require("./FollowingTagRepository");
let UserSuggestionRepository = class UserSuggestionRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.createUserSuggestionsForUser = async (user) => {
            try {
                const followingTagRepo = typeorm_1.getCustomRepository(FollowingTagRepository_1.default);
                // clear all the recommended users from that user
                const result = await this.createQueryBuilder()
                    .delete()
                    .from(UserSuggestion_1.UserSuggestion)
                    .where("userId = :userId", { userId: user.id })
                    .execute();
                // from users YOU FOLLOW
                const mostFollowedUsers = await followingTagRepo.getMostFollowedUsersByUsersYouFollow(user, 40);
                for (const mostFollowedUser of mostFollowedUsers) {
                    await this.save({
                        user: user,
                        suggestedUserId: mostFollowedUser.user.userId,
                        description: mostFollowedUser.count > 1
                            ? "Followed by " + mostFollowedUser.count + " users you know"
                            : "Followed by 1 user you know",
                    });
                }
                // from users YOU DO NOT follow
                const mostFollowedUsers2 = await followingTagRepo.getMostFollowedUsersByUsersYouDONTFollow(user);
                for (const mostFollowedUser of mostFollowedUsers2) {
                    await this.save({
                        user: user,
                        suggestedUserId: mostFollowedUser.user.userId,
                        description: mostFollowedUser.count > 1
                            ? "Followed by " + mostFollowedUser.count + " users"
                            : "Followed by 1 user",
                    });
                }
            }
            catch (e) {
                myConsoleError_1.myConsoleError("error createUserSuggestionsForUser(): " + e.message);
            }
        };
    }
    async getUserSuggestions(forUser) {
        return this.query(`
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
        order by sug."id"`, [forUser.id]);
    }
};
UserSuggestionRepository = __decorate([
    typeorm_1.EntityRepository(UserSuggestion_1.UserSuggestion)
], UserSuggestionRepository);
exports.default = UserSuggestionRepository;
