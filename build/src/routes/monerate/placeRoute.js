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
var PlaceRepository_1 = require("../../repositories/monerate/PlaceRepository");
var ErrorMessage_1 = require("../../utils/ErrorMessage");
var myConsoleError_1 = require("../../utils/myConsoleError");
var placeRoute = express_1.Router();
placeRoute.post('/', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sentPlace, user, placeRepo, results, places, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sentPlace = req.body;
                user = req.user;
                placeRepo = typeorm_1.getCustomRepository(PlaceRepository_1.default);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                if (!sentPlace.id) return [3 /*break*/, 3];
                return [4 /*yield*/, placeRepo.find({ id: sentPlace.id, user: user })];
            case 2:
                results = _a.sent();
                if (!results.length) {
                    return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse('User is not owner of this place.'))];
                }
                _a.label = 3;
            case 3: return [4 /*yield*/, placeRepo.save({
                    id: sentPlace.id,
                    user: user,
                    name: sentPlace.name,
                    bgColor: sentPlace.bgColor,
                    icon: sentPlace.icon
                })];
            case 4:
                _a.sent();
                return [4 /*yield*/, placeRepo.getPlacesFromUser(user)];
            case 5:
                places = _a.sent();
                return [2 /*return*/, res.json(places)];
            case 6:
                err_1 = _a.sent();
                myConsoleError_1.myConsoleError(err_1.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_1.message))];
            case 7: return [2 /*return*/];
        }
    });
}); });
placeRoute.get('/', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var placeRepo, user, places, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                placeRepo = typeorm_1.getCustomRepository(PlaceRepository_1.default);
                user = req.user;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, placeRepo.getPlacesFromUser(user)];
            case 2:
                places = _a.sent();
                return [2 /*return*/, res.json(places)];
            case 3:
                err_2 = _a.sent();
                myConsoleError_1.myConsoleError(err_2.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_2.message))];
            case 4: return [2 /*return*/];
        }
    });
}); });
placeRoute.delete('/:id', authMiddleware_1.default, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var placeRepo, user, placeId, result, places, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                placeRepo = typeorm_1.getCustomRepository(PlaceRepository_1.default);
                user = req.user;
                placeId = parseFloat(req.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, placeRepo.delete({ id: placeId, user: user })];
            case 2:
                result = _a.sent();
                if (!result.affected) return [3 /*break*/, 4];
                return [4 /*yield*/, placeRepo.getPlacesFromUser(user)];
            case 3:
                places = _a.sent();
                return [2 /*return*/, res.status(200).json(places)];
            case 4: return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse('Place id not found, or user is not owner.'))];
            case 5: return [3 /*break*/, 7];
            case 6:
                err_3 = _a.sent();
                myConsoleError_1.myConsoleError(err_3.message);
                return [2 /*return*/, res.status(400).json(new ErrorMessage_1.MyErrorsResponse(err_3.message))];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.default = placeRoute;
//# sourceMappingURL=placeRoute.js.map