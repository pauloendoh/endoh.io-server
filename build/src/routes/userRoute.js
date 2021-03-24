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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var typeorm_1 = require("typeorm");
var UserInfoDto_1 = require("../dtos/UserInfoDto");
var FollowingTag_1 = require("../entities/feed/FollowingTag");
var Profile_1 = require("../entities/feed/Profile");
var Tag_1 = require("../entities/relearn/Tag");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var FollowingTagRepository_1 = require("../repositories/feed/FollowingTagRepository");
var ResourceRepository_1 = require("../repositories/relearn/ResourceRepository");
var UserRepository_1 = require("../repositories/UserRepository");
var ErrorMessage_1 = require("../utils/ErrorMessage");
var myConsoleError_1 = require("../utils/myConsoleError");
var aws_sdk_1 = require("aws-sdk");
var NotificationRepository_1 = require("../repositories/feed/NotificationRepository");
var aws = require('aws-sdk');
var multerConfig = require('../config/multer');
var multer = require('multer');
var userRoute = express_1.Router();
var userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
var resourceRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
var followingTagsRepo = typeorm_1.getCustomRepository(FollowingTagRepository_1.default);
//  PE 2/3 
userRoute.get('/:username/all', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, userInfo, user, _a, _b, _c, _d, _e, _f, err_1;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                username = req.params['username'];
                userInfo = UserInfoDto_1.newUserInfo();
                _g.label = 1;
            case 1:
                _g.trys.push([1, 10, , 11]);
                return [4 /*yield*/, userRepo.findOne({ username: username })];
            case 2:
                user = _g.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json(new ErrorMessage_1.MyErrorsResponse("User not found", "username"))];
                }
                // get all resources (if req.user === user); otherwise, just get from public lists
                _a = userInfo;
                return [4 /*yield*/, resourceRepo.getRatedResourcesFromUser(user, user.id === req.user.id)
                    // profile
                ];
            case 3:
                // get all resources (if req.user === user); otherwise, just get from public lists
                _a.resources = _g.sent();
                // profile
                _b = userInfo;
                return [4 /*yield*/, typeorm_1.getRepository(Profile_1.Profile).findOne({ userId: user.id })
                    // public lists
                ];
            case 4:
                // profile
                _b.profile = _g.sent();
                // public lists
                _c = userInfo;
                return [4 /*yield*/, typeorm_1.getRepository(Tag_1.Tag).find({ userId: user.id, isPrivate: false })
                    // private tags
                ];
            case 5:
                // public lists
                _c.publicLists = _g.sent();
                if (!(user.id === req.user.id)) return [3 /*break*/, 7];
                _d = userInfo;
                return [4 /*yield*/, typeorm_1.getRepository(Tag_1.Tag).find({ userId: user.id, isPrivate: true })];
            case 6:
                _d.privateLists = _g.sent();
                _g.label = 7;
            case 7:
                // following users 
                _e = userInfo;
                return [4 /*yield*/, followingTagsRepo.getFollowingUsers(user)
                    // following users 
                ];
            case 8:
                // following users 
                _e.followingUsers = _g.sent();
                // following users 
                _f = userInfo;
                return [4 /*yield*/, followingTagsRepo.getFollowers(user)];
            case 9:
                // following users 
                _f.followers = _g.sent();
                return [2 /*return*/, res.json(userInfo)];
            case 10:
                err_1 = _g.sent();
                myConsoleError_1.myConsoleError(err_1.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_1.message))];
            case 11: return [2 /*return*/];
        }
    });
}); });
//  PE 2/3 
userRoute.get('/:username/rated-resources', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user, resources, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.params['username'];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, userRepo.findOne({ username: username })];
            case 2:
                user = _a.sent();
                return [4 /*yield*/, resourceRepo.getRatedResourcesFromUser(user, user.id === req.user.id)];
            case 3:
                resources = _a.sent();
                return [2 /*return*/, res.json(resources)];
            case 4:
                err_2 = _a.sent();
                myConsoleError_1.myConsoleError(err_2.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_2.message))];
            case 5: return [2 /*return*/];
        }
    });
}); });
//  PE 2/3 
userRoute.put('/profile', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, profile, profileRepo, savedProfile, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.params['username'];
                profile = req.body;
                // picture will be saved one request later (also, we don't want empty picture strings)
                delete profile['pictureName'];
                delete profile['pictureUrl'];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                profileRepo = typeorm_1.getRepository(Profile_1.Profile);
                return [4 /*yield*/, profileRepo.save(profile)
                    // do this so we can retrieve the profile picture altogether
                ];
            case 2:
                _a.sent();
                return [4 /*yield*/, profileRepo.findOne({ userId: req.user.id })];
            case 3:
                savedProfile = _a.sent();
                return [2 /*return*/, res.json(savedProfile)];
            case 4:
                err_3 = _a.sent();
                myConsoleError_1.myConsoleError(err_3.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_3.message))];
            case 5: return [2 /*return*/];
        }
    });
}); });
userRoute.post('/:username/followingTags', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, tags, repo, user, tagsToNotify, _i, tags_1, tag, found, notification, userFollowingTags, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 13, , 14]);
                username = req.params['username'];
                tags = req.body;
                repo = typeorm_1.getRepository(FollowingTag_1.FollowingTag);
                return [4 /*yield*/, userRepo.findOne({ username: username })
                    // saving all following tags 
                    // PE 1/3 - separar isso em um FollowingTagRepository
                ];
            case 1:
                user = _a.sent();
                tagsToNotify = [];
                _i = 0, tags_1 = tags;
                _a.label = 2;
            case 2:
                if (!(_i < tags_1.length)) return [3 /*break*/, 9];
                tag = tags_1[_i];
                if (!tag.isFollowing) return [3 /*break*/, 6];
                tagsToNotify.push(tag);
                return [4 /*yield*/, repo.findOne({
                        follower: req.user,
                        followingUser: user,
                        tagId: tag.tagId
                    })];
            case 3:
                found = _a.sent();
                if (!!found) return [3 /*break*/, 5];
                return [4 /*yield*/, repo.save({
                        follower: req.user,
                        followingUser: user,
                        tagId: tag.tagId
                    })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, repo.delete({
                    follower: req.user,
                    followingUser: user,
                    tagId: tag.tagId
                })];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 2];
            case 9:
                if (!(tagsToNotify.length > 0)) return [3 /*break*/, 11];
                return [4 /*yield*/, typeorm_1.getCustomRepository(NotificationRepository_1.default)
                        .createFollowingNotification(req.user, user, tagsToNotify)];
            case 10:
                notification = _a.sent();
                _a.label = 11;
            case 11: return [4 /*yield*/, repo.find({ where: { follower: req.user } })];
            case 12:
                userFollowingTags = _a.sent();
                return [2 /*return*/, res.json(userFollowingTags)];
            case 13:
                err_4 = _a.sent();
                myConsoleError_1.myConsoleError(err_4.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_4.message))];
            case 14: return [2 /*return*/];
        }
    });
}); });
//  PE 2/3 
userRoute.get('/:username/followingTags', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user, followingTags, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.params['username'];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, userRepo.findOne({ username: username })];
            case 2:
                user = _a.sent();
                return [4 /*yield*/, followingTagsRepo.find({ where: { follower: user } })];
            case 3:
                followingTags = _a.sent();
                return [2 /*return*/, res.json(followingTags)];
            case 4:
                err_5 = _a.sent();
                myConsoleError_1.myConsoleError(err_5.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_5.message))];
            case 5: return [2 /*return*/];
        }
    });
}); });
//  PE 2/3 >
userRoute.post('/picture', multer(multerConfig).single('file'), authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, key, location, profileRepo, profile, s3, deletePromise, savedProfile, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.file, key = _a.key, location = _a.location;
                profileRepo = typeorm_1.getRepository(Profile_1.Profile);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, profileRepo.findOne({ where: { userId: req.user.id } })
                    // deletando a imagem anterior do usuário
                ];
            case 2:
                profile = _b.sent();
                s3 = new aws_sdk_1.S3();
                deletePromise = s3.deleteObject({
                    Bucket: 'endoh',
                    Key: profile.pictureName
                }).promise();
                // continuando..
                profile.pictureName = key;
                profile.pictureUrl = location;
                return [4 /*yield*/, profileRepo.save(profile)];
            case 3:
                savedProfile = _b.sent();
                return [2 /*return*/, res.status(200).json(savedProfile.pictureUrl)];
            case 4:
                err_6 = _b.sent();
                myConsoleError_1.myConsoleError(err_6.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_6.message))];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = userRoute;
//# sourceMappingURL=userRoute.js.map