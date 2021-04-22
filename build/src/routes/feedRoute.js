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
const authMiddleware_1 = require("../middlewares/authMiddleware");
const FollowingTagRepository_1 = require("../repositories/feed/FollowingTagRepository");
const UserSuggestionRepository_1 = require("../repositories/feed/UserSuggestionRepository");
const ResourceRepository_1 = require("../repositories/relearn/ResourceRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const ErrorMessage_1 = require("../utils/ErrorMessage");
const myConsoleError_1 = require("../utils/myConsoleError");
const feedRoute = express_1.Router();
const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
const resourceRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
const followingTagsRepo = typeorm_1.getCustomRepository(FollowingTagRepository_1.default);
const userSuggestionRepo = typeorm_1.getCustomRepository(UserSuggestionRepository_1.default);
//  PE 2/3 
feedRoute.get('/my-user-suggestions', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userSuggestions = yield userSuggestionRepo.getUserSuggestions(req.user);
        return res.json(userSuggestions);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
}));
//  PE 2/3 
feedRoute.get('/resources', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedResources = yield followingTagsRepo.getFeedResources(req.user);
        return res.json(feedResources);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
}));
exports.default = feedRoute;
//# sourceMappingURL=feedRoute.js.map