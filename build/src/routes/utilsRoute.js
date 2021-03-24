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
var dotenv = require("dotenv");
var express_1 = require("express");
var node_fetch_1 = require("node-fetch");
var typeorm_1 = require("typeorm");
var authMiddleware_1 = require("../middlewares/authMiddleware");
var NotificationRepository_1 = require("../repositories/feed/NotificationRepository");
var ResourceRepository_1 = require("../repositories/relearn/ResourceRepository");
var SkillRepository_1 = require("../repositories/skillbase/SkillRepository");
var UserRepository_1 = require("../repositories/UserRepository");
var isValidEmail_1 = require("../utils/email/isValidEmail");
var sendPasswordResetEmail_1 = require("../utils/email/sendPasswordResetEmail");
var ErrorMessage_1 = require("../utils/ErrorMessage");
var isValidUrl_1 = require("../utils/isValidUrl");
var myConsoleError_1 = require("../utils/myConsoleError");
dotenv.config();
var utilsRoute = express_1.Router();
var userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
utilsRoute.get('/link-preview', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        url = req.query['url'];
        if (!isValidUrl_1.isValidUrl(url)) {
            return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse('URL is not valid', 'url'))];
        }
        try {
            node_fetch_1.default('http://api.linkpreview.net/?key=' + process.env.LINK_PREVIEW_KEY + '&q=' + url)
                .then(function (res) { return res.json(); })
                .then(function (json) {
                var linkPreview = json;
                return res.status(200).json(linkPreview);
            });
        }
        catch (err) {
            myConsoleError_1.myConsoleError(err.message);
            return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err.message))];
        }
        return [2 /*return*/];
    });
}); });
utilsRoute.post('/passwordResetEmail', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, registeredUser, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                email = req.body.email;
                if (!isValidEmail_1.isValidEmail(email)) {
                    return [2 /*return*/, res.sendStatus(400).json(new ErrorMessage_1.MyErrorsResponse("This is not an email lol"))];
                }
                return [4 /*yield*/, userRepo.findOne({ email: email })];
            case 1:
                registeredUser = _a.sent();
                if (!registeredUser) {
                    return [2 /*return*/, res.sendStatus(200)];
                }
                // sending email 
                sendPasswordResetEmail_1.sendPasswordResetEmail(registeredUser);
                return [2 /*return*/, res.sendStatus(200)];
            case 2:
                err_1 = _a.sent();
                myConsoleError_1.myConsoleError(err_1.message);
                return [2 /*return*/, res.sendStatus(400).json(new ErrorMessage_1.MyErrorsResponse(err_1.message))];
            case 3: return [2 /*return*/];
        }
    });
}); });
//  PE 2/3 
utilsRoute.get('/search', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, resourcesRepo, userRepo, skillsRepo, results, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                query = req.query.q;
                resourcesRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
                userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
                skillsRepo = typeorm_1.getCustomRepository(SkillRepository_1.default);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                _a = {};
                return [4 /*yield*/, resourcesRepo.getResourcesByText(req.user, query)];
            case 2:
                _a.resources = _b.sent();
                return [4 /*yield*/, userRepo.getUsersByText(query)];
            case 3:
                _a.users = _b.sent();
                return [4 /*yield*/, skillsRepo.getByText(req.user.id, query)];
            case 4:
                results = (_a.skills = _b.sent(),
                    _a);
                return [2 /*return*/, res.status(200).json(results)];
            case 5:
                err_2 = _b.sent();
                myConsoleError_1.myConsoleError(err_2.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_2.message))];
            case 6: return [2 /*return*/];
        }
    });
}); });
utilsRoute.get('/notifications', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var repo, notifications, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                repo = typeorm_1.getCustomRepository(NotificationRepository_1.default);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, repo.getNotifications(req.user.id)];
            case 2:
                notifications = _a.sent();
                return [2 /*return*/, res.status(200).json(notifications)];
            case 3:
                err_3 = _a.sent();
                myConsoleError_1.myConsoleError(err_3.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_3.message))];
            case 4: return [2 /*return*/];
        }
    });
}); });
utilsRoute.post('/notifications/seeAll', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var notRepo, notifications, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                notRepo = typeorm_1.getCustomRepository(NotificationRepository_1.default);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, notRepo
                        .createQueryBuilder()
                        .update()
                        .set({ seen: true })
                        .where("userId = :userId", { userId: req.user.id })
                        .execute()];
            case 2:
                _a.sent();
                return [4 /*yield*/, notRepo.getNotifications(req.user.id)];
            case 3:
                notifications = _a.sent();
                return [2 /*return*/, res.status(200).json(notifications)];
            case 4:
                err_4 = _a.sent();
                myConsoleError_1.myConsoleError(err_4.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_4.message))];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = utilsRoute;
//# sourceMappingURL=utilsRoute.js.map