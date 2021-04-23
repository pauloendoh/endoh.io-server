"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LolRate_1 = require("../entities/LolRate");
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const FollowingTagRepository_1 = require("../repositories/feed/FollowingTagRepository");
const UserSuggestionRepository_1 = require("../repositories/feed/UserSuggestionRepository");
const ResourceRepository_1 = require("../repositories/relearn/ResourceRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const ErrorMessage_1 = require("../utils/ErrorMessage");
const myConsoleError_1 = require("../utils/myConsoleError");
const lolRatesRoute = express_1.Router();
const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
const resourceRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
const followingTagsRepo = typeorm_1.getCustomRepository(FollowingTagRepository_1.default);
const userSuggestionRepo = typeorm_1.getCustomRepository(UserSuggestionRepository_1.default);
//  PE 2/3 
lolRatesRoute.get('/', async (req, res) => {
    try {
        const connection = typeorm_1.getConnection();
        const results = await typeorm_1.getRepository(LolRate_1.LolRate).find();
        return res.json(results);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
exports.default = lolRatesRoute;
