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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPreferencesForAll = void 0;
var typeorm_1 = require("typeorm");
var UserPreference_1 = require("../../entities/UserPreference");
var UserRepository_1 = require("../../repositories/UserRepository");
var myConsoleError_1 = require("../myConsoleError");
var myConsoleSuccess_1 = require("../myConsoleSuccess");
var createPreferencesForAll = function () { return __awaiter(void 0, void 0, void 0, function () {
    var userRepo, preferenceRepo, preferences, userIds, usersNoPreference, _i, usersNoPreference_1, user, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
                preferenceRepo = typeorm_1.getRepository(UserPreference_1.UserPreference);
                return [4 /*yield*/, preferenceRepo.find({ relations: ['user'] })];
            case 1:
                preferences = _a.sent();
                userIds = preferences.map(function (p) { return p.user.id; });
                usersNoPreference = void 0;
                if (!userIds.length) return [3 /*break*/, 3];
                return [4 /*yield*/, userRepo
                        .find({ id: typeorm_1.Not(typeorm_1.In(__spreadArrays(userIds))) })];
            case 2:
                usersNoPreference = _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, userRepo.find()];
            case 4:
                usersNoPreference = _a.sent();
                _a.label = 5;
            case 5:
                _i = 0, usersNoPreference_1 = usersNoPreference;
                _a.label = 6;
            case 6:
                if (!(_i < usersNoPreference_1.length)) return [3 /*break*/, 9];
                user = usersNoPreference_1[_i];
                return [4 /*yield*/, preferenceRepo.save({
                        user: user
                    })];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9:
                myConsoleSuccess_1.myConsoleSuccess("usersNoPreference: " + usersNoPreference.length);
                return [3 /*break*/, 11];
            case 10:
                e_1 = _a.sent();
                myConsoleError_1.myConsoleError(e_1.message);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.createPreferencesForAll = createPreferencesForAll;
//# sourceMappingURL=createPreferencesForAll.js.map