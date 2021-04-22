"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Notification_1 = require("../../entities/feed/Notification");
const Profile_1 = require("../../entities/feed/Profile");
const ResourceRepository_1 = require("../relearn/ResourceRepository");
const TagRepository_1 = require("../relearn/TagRepository");
const UserRepository_1 = require("../UserRepository");
let NotificationRepository = class NotificationRepository extends typeorm_1.Repository {
    async createFollowingNotification(follower, followedUser, followingTags) {
        const followerProfile = await typeorm_1.getRepository(Profile_1.Profile)
            .findOne({ where: { userId: follower.id } });
        const tagRepo = typeorm_1.getCustomRepository(TagRepository_1.default);
        // building message
        let message = `${follower.username} is following you in `;
        let index = 0;
        for (const followingTag of followingTags) {
            const tag = await tagRepo.findOne({ where: { id: followingTag.tagId } });
            if (followingTags.length === 1) { // if only one
                message += `"${tag.name}"`;
            }
            else if (index === followingTags.length - 1) { // if last one
                message += `and "${tag.name}"`;
            }
            else { // if not last one
                message += `"${tag.name}", `;
            }
            index++;
        }
        // remove any previous notification of this type from the follower 
        this.delete({ type: "follow", userId: followedUser.id, followerId: follower.id });
        return this.save({
            type: "follow",
            userId: followedUser.id,
            message: message,
            followerId: follower.id,
        });
    }
    async createSavedResourceNotification(saverId, resourceId) {
        try {
            const resourceRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
            const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
            const resource = await resourceRepo.findOne({ id: resourceId });
            const owner = await userRepo.findOne({ id: resource.userId });
            const saver = await userRepo.findOne({ id: saverId });
            return this.save({
                type: "userSavedYourResource",
                userId: owner.id,
                message: `${saver.username} saved your resource: ${resource.title}`,
                followerId: saverId,
            });
        }
        catch (err) {
        }
    }
    async getNotifications(userId) {
        return this.query(`
    select ntf."id",
		   ntf."seen",
		   ntf."message",
		   ntf."createdAt",
		   ntf."userId",
		   usu."username",
		   pro."fullName",
		   pro."pictureUrl"
	  from "notification" 	ntf
inner join "user"			usu on usu."id" = ntf."followerId"
inner join "profile"		pro on pro."userId" = ntf."followerId"
     where ntf."userId" = $1
  order by ntf."createdAt" desc`, [userId]);
    }
};
NotificationRepository = __decorate([
    typeorm_1.EntityRepository(Notification_1.Notification)
], NotificationRepository);
exports.default = NotificationRepository;
