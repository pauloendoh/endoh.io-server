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
var authMiddleware_1 = require("../../middlewares/authMiddleware");
var CategoryRepository_1 = require("../../repositories/monerate/CategoryRepository");
var ErrorMessage_1 = require("../../utils/ErrorMessage");
var myConsoleError_1 = require("../../utils/myConsoleError");
var categoryRoute = express_1.Router();
categoryRoute.post('/', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sentCategory, user, categoryRepo, results, categories, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sentCategory = req.body;
                user = req.user;
                categoryRepo = typeorm_1.getCustomRepository(CategoryRepository_1.default);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                if (!sentCategory.id) return [3 /*break*/, 3];
                return [4 /*yield*/, categoryRepo.find({ id: sentCategory.id, user: user })];
            case 2:
                results = _a.sent();
                if (!results.length) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse('User is not owner of this category.'))];
                }
                _a.label = 3;
            case 3: return [4 /*yield*/, categoryRepo.save({
                    id: sentCategory.id,
                    user: user,
                    name: sentCategory.name,
                    bgColor: sentCategory.bgColor,
                    icon: sentCategory.icon
                })];
            case 4:
                _a.sent();
                return [4 /*yield*/, categoryRepo.getCategoriesFromUser(user)];
            case 5:
                categories = _a.sent();
                return [2 /*return*/, res.json(categories)];
            case 6:
                err_1 = _a.sent();
                myConsoleError_1.myConsoleError(err_1.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_1.message))];
            case 7: return [2 /*return*/];
        }
    });
}); });
categoryRoute.get('/', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryRepo, user, categories, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                categoryRepo = typeorm_1.getCustomRepository(CategoryRepository_1.default);
                user = req.user;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, categoryRepo.getCategoriesFromUser(user)];
            case 2:
                categories = _a.sent();
                return [2 /*return*/, res.json(categories)];
            case 3:
                err_2 = _a.sent();
                myConsoleError_1.myConsoleError(err_2.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_2.message))];
            case 4: return [2 /*return*/];
        }
    });
}); });
categoryRoute.delete('/:id', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryRepo, user, categoryId, result, categories, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                categoryRepo = typeorm_1.getCustomRepository(CategoryRepository_1.default);
                user = req.user;
                categoryId = parseFloat(req.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, categoryRepo.delete({ id: categoryId, user: user })];
            case 2:
                result = _a.sent();
                if (!result.affected) return [3 /*break*/, 4];
                return [4 /*yield*/, categoryRepo.getCategoriesFromUser(user)];
            case 3:
                categories = _a.sent();
                return [2 /*return*/, res.status(200).json(categories)];
            case 4: return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Category id not found, or user is not owner.'))];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_3 = _a.sent();
                myConsoleError_1.myConsoleError(err_3.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_3.message))];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.default = categoryRoute;
//# sourceMappingURL=categoryRoute.js.map