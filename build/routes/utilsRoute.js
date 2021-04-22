"use strict";
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
utilsRoute.get('/link-preview', authMiddleware_1.default, async (req, res) => {
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
});
utilsRoute.post('/passwordResetEmail', async (req, res) => {
    try {
        const { email } = req.body;
        if (!isValidEmail_1.isValidEmail(email)) {
            return res.sendStatus(400).json(new ErrorMessage_1.MyErrorsResponse("This is not an email lol"));
        }
        const registeredUser = await userRepo.findOne({ email });
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
});
//  PE 2/3 
utilsRoute.get('/search', authMiddleware_1.default, async (req, res) => {
    const query = req.query.q;
    const resourcesRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
    const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
    const skillsRepo = typeorm_1.getCustomRepository(SkillRepository_1.default);
    try {
        const results = {
            resources: await resourcesRepo.getResourcesByText(req.user, query),
            users: await userRepo.getUsersByText(query),
            skills: await skillsRepo.getByText(req.user.id, query)
        };
        return res.status(200).json(results);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
utilsRoute.get('/notifications', authMiddleware_1.default, async (req, res) => {
    const repo = typeorm_1.getCustomRepository(NotificationRepository_1.default);
    try {
        const notifications = await repo.getNotifications(req.user.id);
        return res.status(200).json(notifications);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
utilsRoute.post('/notifications/seeAll', authMiddleware_1.default, async (req, res) => {
    const notRepo = typeorm_1.getCustomRepository(NotificationRepository_1.default);
    try {
        await notRepo
            .createQueryBuilder()
            .update()
            .set({ seen: true })
            .where("userId = :userId", { userId: req.user.id })
            .execute();
        const notifications = await notRepo.getNotifications(req.user.id);
        return res.status(200).json(notifications);
    }
    catch (err) {
        myConsoleError_1.myConsoleError(err.message);
        return res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message));
    }
});
exports.default = utilsRoute;
