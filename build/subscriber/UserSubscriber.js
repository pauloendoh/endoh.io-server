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
const DocRepository_1 = require("../repositories/define/DocRepository");
const NoteRepository_1 = require("../repositories/define/NoteRepository");
const UserSuggestionRepository_1 = require("../repositories/feed/UserSuggestionRepository");
const ResourceRepository_1 = require("../repositories/relearn/ResourceRepository");
const TagRepository_1 = require("../repositories/relearn/TagRepository");
const SkillExpectationRepository_1 = require("../repositories/skillbase/SkillExpectationRepository");
const SkillRepository_1 = require("../repositories/skillbase/SkillRepository");
const myConsoleError_1 = require("../utils/myConsoleError");
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
            await event.manager.getRepository(Profile_1.Profile).save(profile);
            // Create user suggestions
            await event.manager
                .getCustomRepository(UserSuggestionRepository_1.default)
                .createUserSuggestionsForUser(event.entity);
            // Create user tags
            const tags = await event.manager
                .getCustomRepository(TagRepository_1.default)
                .createTagsForNewUser(event.entity);
            // Create resources
            await event.manager
                .getCustomRepository(ResourceRepository_1.default)
                .createResourcesForNewUser(event.entity, tags);
            // Create skill to Programming tag
            const skills = await event.manager
                .getCustomRepository(SkillRepository_1.default)
                .createSkillsForNewUser(event.entity, tags[0]);
            // Create skill expectations
            await event.manager
                .getCustomRepository(SkillExpectationRepository_1.default)
                .createExpectationsForNewUser(event.entity, skills);
            // Create little prince doc
            const doc = await event.manager
                .getCustomRepository(DocRepository_1.default)
                .createDocForNewUser(event.entity);
            // Create little prince notes
            await event.manager
                .getCustomRepository(NoteRepository_1.default)
                .createNotesForNewUser(event.entity, doc);
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
