"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscriber = void 0;
const typeorm_1 = require("typeorm");
const Profile_1 = require("../entities/feed/Profile");
const User_1 = require("../entities/User");
const UserPreference_1 = require("../entities/UserPreference");
const myConsoleError_1 = require("../utils/myConsoleError");
const createUserSuggestionsForUser_1 = require("../utils/user/createUserSuggestionsForAll/createUserSuggestionsForUser/createUserSuggestionsForUser");
let UserSubscriber = class UserSubscriber {
    /**
     * Indicates that this subscriber only listen to Post events.
     */
    listenTo() {
        return User_1.User;
    }
    /**
     * Called before post insertion.
     */
    async afterInsert(event) {
        try {
            // create default preference
            const preference = new UserPreference_1.UserPreference();
            preference.user = event.entity;
            await event.manager.getRepository(UserPreference_1.UserPreference).save(preference);
            const profile = new Profile_1.Profile();
            profile.user = event.entity;
            // I added this timeout because the event.entity (user).id was not commited yet :/
            setTimeout(async () => {
                await createUserSuggestionsForUser_1.default(event.entity);
            }, 1000);
            await event.manager.getRepository(Profile_1.Profile).save(profile);
        }
        catch (e) {
            myConsoleError_1.myConsoleError(e.message);
        }
    }
};
UserSubscriber = __decorate([
    typeorm_1.EventSubscriber()
], UserSubscriber);
exports.UserSubscriber = UserSubscriber;
//# sourceMappingURL=UserSubscriber.js.map