"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileForUsers = void 0;
const typeorm_1 = require("typeorm");
const Profile_1 = require("../../entities/feed/Profile");
const UserRepository_1 = require("../../repositories/UserRepository");
const myConsoleError_1 = require("../myConsoleError");
const myConsoleSuccess_1 = require("../myConsoleSuccess");
const createProfileForUsers = async () => {
    try {
        const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
        const profile = typeorm_1.getRepository(Profile_1.Profile);
        const preferences = await profile.find({ relations: ['user'] });
        const userIds = preferences.map(p => p.user.id);
        let usersNoProfiles;
        if (userIds.length) {
            usersNoProfiles = await userRepo
                .find({ id: typeorm_1.Not(typeorm_1.In([...userIds])) });
        }
        else
            usersNoProfiles = await userRepo.find();
        for (const user of usersNoProfiles) {
            await profile.save({
                userId: user.id,
                fullName: user.username
            });
        }
        myConsoleSuccess_1.myConsoleSuccess("usersNoProfiles: " + usersNoProfiles.length);
    }
    catch (e) {
        myConsoleError_1.myConsoleError(e.message);
    }
};
exports.createProfileForUsers = createProfileForUsers;
//# sourceMappingURL=createProfileForAll.js.map