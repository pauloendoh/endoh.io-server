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
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const UserInfoDto_1 = require("../dtos/UserInfoDto");
const FollowingTag_1 = require("../entities/feed/FollowingTag");
const Profile_1 = require("../entities/feed/Profile");
const Tag_1 = require("../entities/relearn/Tag");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const FollowingTagRepository_1 = require("../repositories/feed/FollowingTagRepository");
const ResourceRepository_1 = require("../repositories/relearn/ResourceRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const ErrorMessage_1 = require("../utils/ErrorMessage");
const myConsoleError_1 = require("../utils/myConsoleError");
const aws_sdk_1 = require("aws-sdk");
const NotificationRepository_1 = require("../repositories/feed/NotificationRepository");
const aws = require('aws-sdk');
const multerConfig = require('../config/multer');
const multer = require('multer');
const userRoute = express_1.Router();
const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
const resourceRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
const followingTagsRepo = typeorm_1.getCustomRepository(FollowingTagRepository_1.default);
//  PE 2/3 
userRoute.get('/:username/all', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params['username'];
    const userInfo = UserInfoDto_1.newUserInfo();
    try {
        // username exists?
        const user = yield userRepo.findOne({ username });
        if (!user) {
            return res.status(404).json(new ErrorMessage_1.MyErrorsResponse("User not found", "username"));
        }
        // get all resources (if req.user === user); otherwise, just get from public lists
        userInfo.resources = yield resourceRepo.getRatedResourcesFromUser(user, user.id === req.user.id);
        // profile
        userInfo.profile = yield typeorm_1.getRepository(Profile_1.Profile).findOne({ userId: user.id });
        // public lists
        userInfo.publicLists = yield typeorm_1.getRepository(Tag_1.Tag).find({ userId: user.id, isPrivate: false });
        // private tags
        if (user.id === req.user.id) {
            userInfo.privateLists = yield typeorm_1.getRepository(Tag_1.Tag).find({ userId: user.id, isPrivate: true });
        }
        // following users 
        userInfo.followingUsers = yield followingTagsRepo.getFollowingUsers(user);
        // following users 
        userInfo.followers = yield followingTagsRepo.getFollowers(user);
        return res.json(userInfo);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
}));
//  PE 2/3 
userRoute.get('/:username/rated-resources', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params['username'];
    try {
        // username exists?
        const user = yield userRepo.findOne({ username });
        const resources = yield resourceRepo.getRatedResourcesFromUser(user, user.id === req.user.id);
        return res.json(resources);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
}));
//  PE 2/3 
userRoute.put('/profile', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params['username'];
    const profile = req.body;
    // picture will be saved one request later (also, we don't want empty picture strings)
    delete profile['pictureName'];
    delete profile['pictureUrl'];
    try {
        const profileRepo = typeorm_1.getRepository(Profile_1.Profile);
        yield profileRepo.save(profile);
        // do this so we can retrieve the profile picture altogether
        const savedProfile = yield profileRepo.findOne({ userId: req.user.id });
        return res.json(savedProfile);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
}));
userRoute.post('/:username/followingTags', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.params['username'];
        const tags = req.body;
        const repo = typeorm_1.getRepository(FollowingTag_1.FollowingTag);
        // username exists?
        const user = yield userRepo.findOne({ username });
        // saving all following tags 
        // PE 1/3 - separar isso em um FollowingTagRepository
        const tagsToNotify = [];
        for (const tag of tags) {
            if (tag.isFollowing) {
                tagsToNotify.push(tag);
                const found = yield repo.findOne({
                    follower: req.user,
                    followingUser: user,
                    tagId: tag.tagId
                });
                if (!found) {
                    yield repo.save({
                        follower: req.user,
                        followingUser: user,
                        tagId: tag.tagId
                    });
                }
            }
            else {
                yield repo.delete({
                    follower: req.user,
                    followingUser: user,
                    tagId: tag.tagId
                });
            }
        }
        // notify user 
        if (tagsToNotify.length > 0) {
            const notification = yield typeorm_1.getCustomRepository(NotificationRepository_1.default)
                .createFollowingNotification(req.user, user, tagsToNotify);
        }
        const userFollowingTags = yield repo.find({ where: { follower: req.user } });
        return res.json(userFollowingTags);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
}));
//  PE 2/3 
userRoute.get('/:username/followingTags', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params['username'];
    try {
        // username exists?
        const user = yield userRepo.findOne({ username });
        const followingTags = yield followingTagsRepo.find({ where: { follower: user } });
        return res.json(followingTags);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
}));
//  PE 2/3 >
userRoute.post('/picture', multer(multerConfig).single('file'), authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, location } = req.file;
    const profileRepo = typeorm_1.getRepository(Profile_1.Profile);
    try {
        const profile = yield profileRepo.findOne({ where: { userId: req.user.id } });
        // deletando a imagem anterior do usuário
        const s3 = new aws_sdk_1.S3();
        const deletePromise = s3.deleteObject({
            Bucket: 'endoh',
            Key: profile.pictureName
        }).promise();
        // continuando..
        profile.pictureName = key;
        profile.pictureUrl = location;
        const savedProfile = yield profileRepo.save(profile);
        return res.status(200).json(savedProfile.pictureUrl);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
}));
exports.default = userRoute;
//# sourceMappingURL=userRoute.js.map