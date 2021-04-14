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
exports.createPreferencesForAll = void 0;
const typeorm_1 = require("typeorm");
const UserPreference_1 = require("../../entities/UserPreference");
const UserRepository_1 = require("../../repositories/UserRepository");
const myConsoleError_1 = require("../myConsoleError");
const myConsoleSuccess_1 = require("../myConsoleSuccess");
const createPreferencesForAll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
        const preferenceRepo = typeorm_1.getRepository(UserPreference_1.UserPreference);
        const preferences = yield preferenceRepo.find({ relations: ['user'] });
        const userIds = preferences.map(p => p.user.id);
        let usersNoPreference;
        if (userIds.length) {
            usersNoPreference = yield userRepo
                .find({ id: typeorm_1.Not(typeorm_1.In([...userIds])) });
        }
        else
            usersNoPreference = yield userRepo.find();
        for (const user of usersNoPreference) {
            yield preferenceRepo.save({
                user: user
            });
        }
        myConsoleSuccess_1.myConsoleSuccess("usersNoPreference: " + usersNoPreference.length);
    }
    catch (e) {
        myConsoleError_1.myConsoleError(e.message);
    }
});
exports.createPreferencesForAll = createPreferencesForAll;
//# sourceMappingURL=createPreferencesForAll.js.map