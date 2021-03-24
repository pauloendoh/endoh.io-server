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
var SkillProgress_1 = require("../../entities/skillbase/SkillProgress");
var authMiddleware_1 = require("../../middlewares/authMiddleware");
var SkillRepository_1 = require("../../repositories/skillbase/SkillRepository");
var ErrorMessage_1 = require("../../utils/ErrorMessage");
var myConsoleError_1 = require("../../utils/myConsoleError");
var skillRoute = express_1.Router();
var skillRepo = typeorm_1.getCustomRepository(SkillRepository_1.default);
skillRoute.get('/', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, skills, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, skillRepo.getAllFromUser(user.id)];
            case 2:
                skills = _a.sent();
                return [2 /*return*/, res.status(200).json(skills)];
            case 3:
                err_1 = _a.sent();
                myConsoleError_1.myConsoleError(err_1.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_1.message))];
            case 4: return [2 /*return*/];
        }
    });
}); });
skillRoute.post('/', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sentSkill, user, found, newProgress, allSkills, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sentSkill = req.body;
                user = req.user;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                if (!sentSkill.id) return [3 /*break*/, 4];
                return [4 /*yield*/, skillRepo.findOne({ id: sentSkill.id, user: user })];
            case 2:
                found = _a.sent();
                if (!found) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse("Now owner."))];
                }
                if (!(found.currentLevel > 0 &&
                    (found.currentLevel < sentSkill.currentLevel))) return [3 /*break*/, 4];
                newProgress = new SkillProgress_1.SkillProgress();
                newProgress.userId = user.id;
                newProgress.skillId = sentSkill.id;
                newProgress.oldLevel = found.currentLevel;
                newProgress.newLevel = sentSkill.currentLevel;
                newProgress.goalLevel = sentSkill.goalLevel;
                return [4 /*yield*/, typeorm_1.getRepository(SkillProgress_1.SkillProgress).save(newProgress)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                sentSkill.userId = req.user.id;
                return [4 /*yield*/, skillRepo.save(sentSkill)];
            case 5:
                _a.sent();
                return [4 /*yield*/, skillRepo.getAllFromUser(user.id)];
            case 6:
                allSkills = _a.sent();
                return [2 /*return*/, res.status(200).json(allSkills)];
            case 7:
                err_2 = _a.sent();
                myConsoleError_1.myConsoleError(err_2.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_2.message))];
            case 8: return [2 /*return*/];
        }
    });
}); });
skillRoute.put('/:id', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, skillId, sentSkill, isOwner, savedSkill, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                skillId = Number(req.params['id']);
                sentSkill = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, skillRepo.findOne({ userId: user.id, id: skillId })];
            case 2:
                isOwner = _a.sent();
                if (!isOwner) return [3 /*break*/, 4];
                sentSkill.id = skillId;
                return [4 /*yield*/, skillRepo.save(sentSkill)];
            case 3:
                savedSkill = _a.sent();
                return [2 /*return*/, res.status(200).json(savedSkill)];
            case 4: return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse("User is not owner or id doesn't exist"))];
            case 5:
                err_3 = _a.sent();
                myConsoleError_1.myConsoleError(err_3.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_3.message))];
            case 6: return [2 /*return*/];
        }
    });
}); });
skillRoute.delete('/', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, ids, skills, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                ids = req.body.ids;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, skillRepo.deleteIdsFromUser(ids, user.id)];
            case 2:
                _a.sent();
                return [4 /*yield*/, skillRepo.getAllFromUser(user.id)];
            case 3:
                skills = _a.sent();
                return [2 /*return*/, res.status(200).json(skills)];
            case 4:
                err_4 = _a.sent();
                myConsoleError_1.myConsoleError(err_4.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_4.message))];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = skillRoute;
//# sourceMappingURL=skillRoute.js.map