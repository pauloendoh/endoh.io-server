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
const dotenv = require("dotenv");
const express_1 = require("express");
const node_fetch_1 = require("node-fetch");
const typeorm_1 = require("typeorm");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const NotificationRepository_1 = require("../repositories/feed/NotificationRepository");
const ResourceRepository_1 = require("../repositories/relearn/ResourceRepository");
const SkillRepository_1 = require("../repositories/skillbase/SkillRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const isValidEmail_1 = require("../utils/email/isValidEmail");
const sendPasswordResetEmail_1 = require("../utils/email/sendPasswordResetEmail");
const ErrorMessage_1 = require("../utils/ErrorMessage");
const isValidUrl_1 = require("../utils/isValidUrl");
const myConsoleError_1 = require("../utils/myConsoleError");
dotenv.config();
const utilsRoute = express_1.Router();
const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
utilsRoute.get('/link-preview', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.query['url'];
    if (!isValidUrl_1.isValidUrl(url)) {
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse('URL is not valid', 'url'));
    }
    try {
        node_fetch_1.default('http://api.linkpreview.net/?key=' + process.env.LINK_PREVIEW_KEY + '&q=' + url)
            .then(res => res.json())
            .then(json => {
            const linkPreview = json;
            return res.status(200).json(linkPreview);
        });
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
}));
utilsRoute.post('/passwordResetEmail', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!isValidEmail_1.isValidEmail(email)) {
            return res.sendStatus(400).json(new ErrorMessage_1.MyErrorsResponse("This is not an email lol"));
        }
        const registeredUser = yield userRepo.findOne({ email });
        if (!registeredUser) {
            return res.sendStatus(200);
        }
        // sending email 
        sendPasswordResetEmail_1.sendPasswordResetEmail(registeredUser);
        return res.sendStatus(200);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.sendStatus(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
}));
//  PE 2/3 
utilsRoute.get('/search', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.q;
    const resourcesRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
    const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
    const skillsRepo = typeorm_1.getCustomRepository(SkillRepository_1.default);
    try {
        const results = {
            resources: yield resourcesRepo.getResourcesByText(req.user, query),
            users: yield userRepo.getUsersByText(query),
            skills: yield skillsRepo.getByText(req.user.id, query)
        };
        return res.status(200).json(results);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
}));
utilsRoute.get('/notifications', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repo = typeorm_1.getCustomRepository(NotificationRepository_1.default);
    try {
        const notifications = yield repo.getNotifications(req.user.id);
        return res.status(200).json(notifications);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
}));
utilsRoute.post('/notifications/seeAll', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notRepo = typeorm_1.getCustomRepository(NotificationRepository_1.default);
    try {
        yield notRepo
            .createQueryBuilder()
            .update()
            .set({ seen: true })
            .where("userId = :userId", { userId: req.user.id })
            .execute();
        const notifications = yield notRepo.getNotifications(req.user.id);
        return res.status(200).json(notifications);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
}));
exports.default = utilsRoute;
//# sourceMappingURL=utilsRoute.js.map