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
const typeorm_1 = require("typeorm");
const Doc_1 = require("./define/Doc");
const Note_1 = require("./define/Note");
const FollowingTag_1 = require("./feed/FollowingTag");
const Notification_1 = require("./feed/Notification");
const Profile_1 = require("./feed/Profile");
const UserSuggestion_1 = require("./feed/UserSuggestion");
const Category_1 = require("./monerate/Category");
const Expense_1 = require("./monerate/Expense");
const Place_1 = require("./monerate/Place");
const OAuthToken_1 = require("./OAuthToken");
const Tag_1 = require("./relearn/Tag");
const Skill_1 = require("./skillbase/Skill");
const SkillExpectation_1 = require("./skillbase/SkillExpectation");
const SkillProgress_1 = require("./skillbase/SkillProgress");
const UserPreference_1 = require("./UserPreference");
let User = class User {
};
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
    typeorm_1.Column({ type: "timestamptz", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "expiresAt", void 0);
__decorate([
    typeorm_1.OneToOne((type) => UserPreference_1.UserPreference, (preference) => preference.user, {
        eager: true,
    }),
    __metadata("design:type", UserPreference_1.UserPreference)
], User.prototype, "preference", void 0);
__decorate([
    typeorm_1.OneToOne((type) => Profile_1.Profile, (profile) => profile.user),
    __metadata("design:type", Profile_1.Profile)
], User.prototype, "profile", void 0);
__decorate([
    typeorm_1.OneToMany((type) => Expense_1.Expense, (expense) => expense.user),
    __metadata("design:type", Array)
], User.prototype, "expenses", void 0);
__decorate([
    typeorm_1.OneToMany((type) => Category_1.default, (category) => category.user),
    __metadata("design:type", Array)
], User.prototype, "categories", void 0);
__decorate([
    typeorm_1.OneToMany((type) => Place_1.default, (place) => place.user),
    __metadata("design:type", Array)
], User.prototype, "places", void 0);
__decorate([
    typeorm_1.OneToMany((type) => OAuthToken_1.UserToken, (oauthToken) => oauthToken.user),
    __metadata("design:type", Array)
], User.prototype, "tokens", void 0);
__decorate([
    typeorm_1.OneToMany((type) => Tag_1.Tag, (tag) => tag.user),
    __metadata("design:type", Array)
], User.prototype, "tags", void 0);
__decorate([
    typeorm_1.OneToMany((type) => Skill_1.Skill, (skill) => skill.user),
    __metadata("design:type", Array)
], User.prototype, "skills", void 0);
__decorate([
    typeorm_1.OneToMany((type) => SkillExpectation_1.SkillExpectation, (skillExpectation) => skillExpectation.user),
    __metadata("design:type", Array)
], User.prototype, "skillExpectations", void 0);
__decorate([
    typeorm_1.OneToMany((type) => SkillProgress_1.SkillProgress, (progress) => progress.user),
    __metadata("design:type", Array)
], User.prototype, "skillProgresses", void 0);
__decorate([
    typeorm_1.OneToMany((type) => FollowingTag_1.FollowingTag, (followingTag) => followingTag.follower),
    __metadata("design:type", Array)
], User.prototype, "followingTags", void 0);
__decorate([
    typeorm_1.OneToMany((type) => FollowingTag_1.FollowingTag, (followingTag) => followingTag.followingUser),
    __metadata("design:type", Array)
], User.prototype, "followerTags", void 0);
__decorate([
    typeorm_1.OneToMany((type) => UserSuggestion_1.UserSuggestion, (userSuggestion) => userSuggestion.user),
    __metadata("design:type", Array)
], User.prototype, "userSuggestions", void 0);
__decorate([
    typeorm_1.OneToMany((type) => UserSuggestion_1.UserSuggestion, (userSuggestion) => userSuggestion.suggestedUser),
    __metadata("design:type", Array)
], User.prototype, "suggestedBy", void 0);
__decorate([
    typeorm_1.OneToMany((type) => Notification_1.Notification, (notification) => notification.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    typeorm_1.OneToMany((type) => Notification_1.Notification, (notification) => notification.follower),
    __metadata("design:type", Array)
], User.prototype, "followingNotifications", void 0);
__decorate([
    typeorm_1.OneToMany(() => Doc_1.Doc, (doc) => doc.user),
    __metadata("design:type", Array)
], User.prototype, "docs", void 0);
__decorate([
    typeorm_1.OneToMany(() => Note_1.Note, (note) => note.user),
    __metadata("design:type", Array)
], User.prototype, "notes", void 0);
User = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
