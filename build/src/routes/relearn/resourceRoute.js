"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var authMiddleware_1 = require("../../middlewares/authMiddleware");
var ResourceRepository_1 = require("../../repositories/relearn/ResourceRepository");
var ErrorMessage_1 = require("../../utils/ErrorMessage");
var myConsoleError_1 = require("../../utils/myConsoleError");
var resourceRoute = express_1.Router();
// PE 1/3 - it's getting way too slow 
resourceRoute.post('/', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sentResource, resourceRepo, user, previousResource, _a, _b, _c, resources, err_1;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                sentResource = req.body;
                resourceRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
                user = req.user;
                _f.label = 1;
            case 1:
                _f.trys.push([1, 15, , 16]);
                if (!sentResource.id) return [3 /*break*/, 10];
                return [4 /*yield*/, resourceRepo.findOne({ id: sentResource.id, user: user }, { relations: ['tag'] })
                    // Check ownership
                ];
            case 2:
                previousResource = _f.sent();
                // Check ownership
                if (!previousResource) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse("User doesn't own this resource."))];
                }
                if (!((previousResource.rating === null || previousResource.rating === 0) && sentResource.rating > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, resourceRepo
                        .reducePosition(sentResource.tag, user, sentResource.position + 1)];
            case 3:
                _f.sent();
                sentResource.completedAt = new Date().toISOString();
                sentResource.position = null;
                return [3 /*break*/, 6];
            case 4:
                if (!(previousResource.rating > 0 && sentResource.rating === null)) return [3 /*break*/, 6];
                sentResource.completedAt = '';
                _a = sentResource;
                return [4 /*yield*/, resourceRepo.getLastPosition(sentResource.tag, user)];
            case 5:
                _a.position = _f.sent();
                _f.label = 6;
            case 6:
                if (!(((previousResource.tag === null && sentResource.tag !== null) // adding tag
                    || (previousResource.tag !== null && sentResource.tag === null) // removing tag
                    || (((_d = previousResource.tag) === null || _d === void 0 ? void 0 : _d.id) != ((_e = sentResource.tag) === null || _e === void 0 ? void 0 : _e.id))) // changing tag
                    && previousResource.position)) return [3 /*break*/, 9];
                return [4 /*yield*/, resourceRepo
                        .reducePosition(previousResource.tag, user, previousResource.position + 1)];
            case 7:
                _f.sent();
                _b = sentResource;
                return [4 /*yield*/, resourceRepo
                        .getLastPosition(sentResource.tag, user)];
            case 8:
                _b.position = _f.sent();
                _f.label = 9;
            case 9: return [3 /*break*/, 12];
            case 10:
                // if adding resource, check tag's last resource's position
                _c = sentResource;
                return [4 /*yield*/, resourceRepo.getLastPosition(sentResource.tag, user)];
            case 11:
                // if adding resource, check tag's last resource's position
                _c.position = _f.sent();
                sentResource.user = user;
                sentResource.userId = user.id;
                _f.label = 12;
            case 12: return [4 /*yield*/, resourceRepo.save(sentResource)];
            case 13:
                _f.sent();
                return [4 /*yield*/, resourceRepo.getAllResourcesFromUser(user)];
            case 14:
                resources = _f.sent();
                return [2 /*return*/, res.status(200).json(resources)];
            case 15:
                err_1 = _f.sent();
                myConsoleError_1.myConsoleError(err_1.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_1.message))];
            case 16: return [2 /*return*/];
        }
    });
}); });
//  PE 2/3 
resourceRoute.get('/', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resourceRepo, user, resources, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resourceRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
                user = req.user;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, resourceRepo.getAllResourcesFromUser(user)];
            case 2:
                resources = _a.sent();
                return [2 /*return*/, res.json(resources)];
            case 3:
                err_2 = _a.sent();
                myConsoleError_1.myConsoleError(err_2.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_2.message))];
            case 4: return [2 /*return*/];
        }
    });
}); });
// PE 2/3 
resourceRoute.delete('/:id', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resourceRepo, user, resourceId, result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resourceRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
                user = req.user;
                resourceId = parseFloat(req.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, resourceRepo.delete({ id: resourceId, user: user })];
            case 2:
                result = _a.sent();
                if (result.affected) {
                    return [2 /*return*/, res.status(200).json("Expense id=" + resourceId + " deleted.")];
                }
                else {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Resource id not found, or user is not owner.'))];
                }
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                myConsoleError_1.myConsoleError(err_3.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_3.message))];
            case 4: return [2 /*return*/];
        }
    });
}); });
// PE 2/3 
resourceRoute.post('/resources', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sentResources, user, resourceRepo, verifiedResources, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sentResources = req.body;
                user = req.user;
                resourceRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, resourceRepo
                        .find({
                        where: {
                            id: typeorm_1.In(sentResources.map(function (r) { return r.id; })),
                            userId: user.id
                        }
                    })];
            case 2:
                verifiedResources = _a.sent();
                if (verifiedResources.length !== sentResources.length) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse("User does not own all sent resources."))];
                }
                return [4 /*yield*/, resourceRepo.save(sentResources)];
            case 3:
                _a.sent();
                return [2 /*return*/, res.status(200).json("Saved")];
            case 4:
                err_4 = _a.sent();
                myConsoleError_1.myConsoleError(err_4.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_4.message))];
            case 5: return [2 /*return*/];
        }
    });
}); });
// PE 2/3 
resourceRoute.post('/duplicate/:id', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resourceRepo, user, resourceId, resource, resources, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resourceRepo = typeorm_1.getCustomRepository(ResourceRepository_1.default);
                user = req.user;
                resourceId = parseFloat(req.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                return [4 /*yield*/, resourceRepo.findOne({
                        where: { id: resourceId, user: user }
                    })];
            case 2:
                resource = _a.sent();
                if (!resource) return [3 /*break*/, 6];
                if (resource.completedAt.length > 0) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse("Can't duplicate completed resources."))];
                }
                // empurra todos após o :id
                return [4 /*yield*/, resourceRepo.increasePositionByOne(resource.tagId, user, resource.position + 1)
                    // insere uma cópia na próxima posição
                ];
            case 3:
                // empurra todos após o :id
                _a.sent();
                // insere uma cópia na próxima posição
                return [4 /*yield*/, resourceRepo.save(__assign(__assign({}, resource), { id: null, position: resource.position + 1, createdAt: undefined, updatedAt: undefined }))
                    // retorna todos os resources
                ];
            case 4:
                // insere uma cópia na próxima posição
                _a.sent();
                return [4 /*yield*/, resourceRepo.getAllResourcesFromUser(user)];
            case 5:
                resources = _a.sent();
                return [2 /*return*/, res.status(200).json(resources)];
            case 6: return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Resource id not found, or user is not owner.'))];
            case 7: return [3 /*break*/, 9];
            case 8:
                err_5 = _a.sent();
                myConsoleError_1.myConsoleError(err_5.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_5.message))];
            case 9: return [2 /*return*/];
        }
    });
}); });
exports.default = resourceRoute;
//# sourceMappingURL=resourceRoute.js.map