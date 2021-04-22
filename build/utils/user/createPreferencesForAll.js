"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPreferencesForAll = void 0;
const typeorm_1 = require("typeorm");
const UserPreference_1 = require("../../entities/UserPreference");
const UserRepository_1 = require("../../repositories/UserRepository");
const myConsoleError_1 = require("../myConsoleError");
const myConsoleSuccess_1 = require("../myConsoleSuccess");
const createPreferencesForAll = async () => {
    try {
        const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
        const preferenceRepo = typeorm_1.getRepository(UserPreference_1.UserPreference);
        const preferences = await preferenceRepo.find({ relations: ['user'] });
        const userIds = preferences.map(p => p.user.id);
        let usersNoPreference;
        if (userIds.length) {
            usersNoPreference = await userRepo
                .find({ id: typeorm_1.Not(typeorm_1.In([...userIds])) });
        }
        else
            usersNoPreference = await userRepo.find();
        for (const user of usersNoPreference) {
            await preferenceRepo.save({
                user: user
            });
        }
        myConsoleSuccess_1.myConsoleSuccess("usersNoPreference: " + usersNoPreference.length);
    }
    catch (e) {
        myConsoleError_1.myConsoleError(e.message);
    }
};
exports.createPreferencesForAll = createPreferencesForAll;
//# sourceMappingURL=createPreferencesForAll.js.map