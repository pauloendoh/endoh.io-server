"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var typeorm_1 = require("typeorm");
var FollowingTag_1 = require("./feed/FollowingTag");
var Notification_1 = require("./feed/Notification");
var Profile_1 = require("./feed/Profile");
var UserSuggestion_1 = require("./feed/UserSuggestion");
var Category_1 = require("./monerate/Category");
var Expense_1 = require("./monerate/Expense");
var Place_1 = require("./monerate/Place");
var OAuthToken_1 = require("./OAuthToken");
var Tag_1 = require("./relearn/Tag");
var Skill_1 = require("./skillbase/Skill");
var SkillProgress_1 = require("./skillbase/SkillProgress");
var UserPreference_1 = require("./UserPreference");
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], User.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column({ unique: true, nullable: true }),
        __metadata("design:type", String)
    ], User.prototype, "googleId", void 0);
    __decorate([
        typeorm_1.Column({ unique: true }),
        __metadata("design:type", String)
    ], User.prototype, "username", void 0);
    __decorate([
        typeorm_1.Column({ unique: true }),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    __decorate([
        typeorm_1.Column({ default: false }),
        __metadata("design:type", Boolean)
    ], User.prototype, "isAdmin", void 0);
    __decorate([
        typeorm_1.CreateDateColumn(),
        __metadata("design:type", Date)
    ], User.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn(),
        __metadata("design:type", Date)
    ], User.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.Column({ type: 'timestamptz', nullable: true }),
        __metadata("design:type", String)
    ], User.prototype, "expiresAt", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return UserPreference_1.UserPreference; }, function (preference) { return preference.user; }, { eager: true }),
        __metadata("design:type", UserPreference_1.UserPreference)
    ], User.prototype, "preference", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return Profile_1.Profile; }, function (profile) { return profile.user; }),
        __metadata("design:type", Profile_1.Profile)
    ], User.prototype, "profile", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Expense_1.Expense; }, function (expense) { return expense.user; }),
        __metadata("design:type", Array)
    ], User.prototype, "expenses", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Category_1.default; }, function (category) { return category.user; }),
        __metadata("design:type", Array)
    ], User.prototype, "categories", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Place_1.default; }, function (place) { return place.user; }),
        __metadata("design:type", Array)
    ], User.prototype, "places", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return OAuthToken_1.UserToken; }, function (oauthToken) { return oauthToken.user; }),
        __metadata("design:type", Array)
    ], User.prototype, "tokens", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Tag_1.Tag; }, function (tag) { return tag.user; }),
        __metadata("design:type", Array)
    ], User.prototype, "tags", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Skill_1.Skill; }, function (skill) { return skill.user; }),
        __metadata("design:type", Array)
    ], User.prototype, "skills", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return SkillProgress_1.SkillProgress; }, function (progress) { return progress.user; }),
        __metadata("design:type", Array)
    ], User.prototype, "skillProgresses", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return FollowingTag_1.FollowingTag; }, function (followingTag) { return followingTag.follower; }),
        __metadata("design:type", Array)
    ], User.prototype, "followingTags", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return FollowingTag_1.FollowingTag; }, function (followingTag) { return followingTag.followingUser; }),
        __metadata("design:type", Array)
    ], User.prototype, "followerTags", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return UserSuggestion_1.UserSuggestion; }, function (userSuggestion) { return userSuggestion.user; }),
        __metadata("design:type", Array)
    ], User.prototype, "userSuggestions", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return UserSuggestion_1.UserSuggestion; }, function (userSuggestion) { return userSuggestion.suggestedUser; }),
        __metadata("design:type", Array)
    ], User.prototype, "suggestedBy", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Notification_1.Notification; }, function (notification) { return notification.user; }),
        __metadata("design:type", Array)
    ], User.prototype, "notifications", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Notification_1.Notification; }, function (notification) { return notification.follower; }),
        __metadata("design:type", Array)
    ], User.prototype, "followingNotifications", void 0);
    User = __decorate([
        typeorm_1.Entity()
    ], User);
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map