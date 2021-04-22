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
exports.createUserSuggestionsForAll = void 0;
var typeorm_1 = require("typeorm");
var UserSuggestion_1 = require("../../entities/feed/UserSuggestion");
var User_1 = require("../../entities/User");
var FollowingTagRepository_1 = require("../../repositories/feed/FollowingTagRepository");
var myConsoleError_1 = require("../myConsoleError");
var myConsoleSuccess_1 = require("../myConsoleSuccess");
var createUserSuggestionsForAll = function () { return __awaiter(void 0, void 0, void 0, function () {
    var followingTagRepo, allUsers, _i, allUsers_1, user, result, mostFollowedUsers, _a, mostFollowedUsers_1, mostFollowedUser, mostFollowedUsers2, _b, mostFollowedUsers2_1, mostFollowedUser, e_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 15, , 16]);
                myConsoleSuccess_1.myConsoleSuccess("running createUserSuggestionsForAll()");
                followingTagRepo = typeorm_1.getCustomRepository(FollowingTagRepository_1.default);
                return [4 /*yield*/, typeorm_1.getRepository(User_1.User).find()];
            case 1:
                allUsers = _c.sent();
                _i = 0, allUsers_1 = allUsers;
                _c.label = 2;
            case 2:
                if (!(_i < allUsers_1.length)) return [3 /*break*/, 14];
                user = allUsers_1[_i];
                return [4 /*yield*/, typeorm_1.getConnection()
                        .createQueryBuilder()
                        .delete()
                        .from(UserSuggestion_1.UserSuggestion)
                        .where("userId = :userId", { userId: user.id })
                        .execute()];
            case 3:
                result = _c.sent();
                console.log(result);
                return [4 /*yield*/, followingTagRepo.getMostFollowedUsersByUsersYouFollow(user, 40)];
            case 4:
                mostFollowedUsers = _c.sent();
                _a = 0, mostFollowedUsers_1 = mostFollowedUsers;
                _c.label = 5;
            case 5:
                if (!(_a < mostFollowedUsers_1.length)) return [3 /*break*/, 8];
                mostFollowedUser = mostFollowedUsers_1[_a];
                return [4 /*yield*/, typeorm_1.getRepository(UserSuggestion_1.UserSuggestion).save({
                        user: user,
                        suggestedUserId: mostFollowedUser.user.userId,
                        description: mostFollowedUser.count > 1 ?
                            'Followed by ' + mostFollowedUser.count + 'users you know' : "Followed by 1 user you know"
                    })];
            case 6:
                _c.sent();
                _c.label = 7;
            case 7:
                _a++;
                return [3 /*break*/, 5];
            case 8: return [4 /*yield*/, followingTagRepo.getMostFollowedUsersByUsersYouDONTFollow(user)];
            case 9:
                mostFollowedUsers2 = _c.sent();
                _b = 0, mostFollowedUsers2_1 = mostFollowedUsers2;
                _c.label = 10;
            case 10:
                if (!(_b < mostFollowedUsers2_1.length)) return [3 /*break*/, 13];
                mostFollowedUser = mostFollowedUsers2_1[_b];
                return [4 /*yield*/, typeorm_1.getRepository(UserSuggestion_1.UserSuggestion).save({
                        user: user,
                        suggestedUserId: mostFollowedUser.user.userId,
                        description: mostFollowedUser.count > 1 ?
                            'Followed by ' + mostFollowedUser.count + 'users' : "Followed by 1 user"
                    })];
            case 11:
                _c.sent();
                _c.label = 12;
            case 12:
                _b++;
                return [3 /*break*/, 10];
            case 13:
                _i++;
                return [3 /*break*/, 2];
            case 14:
                myConsoleSuccess_1.myConsoleSuccess("success createUserSuggestionsForAll()");
                return [3 /*break*/, 16];
            case 15:
                e_1 = _c.sent();
                myConsoleError_1.myConsoleError("error createUserSuggestionsForAll(): " + e_1.message);
                return [3 /*break*/, 16];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.createUserSuggestionsForAll = createUserSuggestionsForAll;
//# sourceMappingURL=createUserSuggestionsForAll.js.map