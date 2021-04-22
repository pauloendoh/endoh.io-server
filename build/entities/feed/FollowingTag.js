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
exports.FollowingTag = void 0;
const typeorm_1 = require("typeorm");
const Tag_1 = require("../relearn/Tag");
const User_1 = require("../User");
let FollowingTag = class FollowingTag {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], FollowingTag.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.followingTags, { onDelete: "CASCADE" }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", User_1.User)
], FollowingTag.prototype, "follower", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], FollowingTag.prototype, "followerId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.followingTags, { onDelete: "CASCADE" }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", User_1.User)
], FollowingTag.prototype, "followingUser", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], FollowingTag.prototype, "followingUserId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Tag_1.Tag, tag => tag.tagFollowers, { onDelete: "CASCADE" }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Tag_1.Tag)
], FollowingTag.prototype, "tag", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], FollowingTag.prototype, "tagId", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], FollowingTag.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], FollowingTag.prototype, "updatedAt", void 0);
FollowingTag = __decorate([
    typeorm_1.Entity()
], FollowingTag);
exports.FollowingTag = FollowingTag;
