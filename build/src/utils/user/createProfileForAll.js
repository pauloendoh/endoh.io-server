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
exports.createProfileForUsers = void 0;
const typeorm_1 = require("typeorm");
const Profile_1 = require("../../entities/feed/Profile");
const UserRepository_1 = require("../../repositories/UserRepository");
const myConsoleError_1 = require("../myConsoleError");
const myConsoleSuccess_1 = require("../myConsoleSuccess");
const createProfileForUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepo = typeorm_1.getCustomRepository(UserRepository_1.default);
        const profile = typeorm_1.getRepository(Profile_1.Profile);
        const preferences = yield profile.find({ relations: ['user'] });
        const userIds = preferences.map(p => p.user.id);
        let usersNoProfiles;
        if (userIds.length) {
            usersNoProfiles = yield userRepo
                .find({ id: typeorm_1.Not(typeorm_1.In([...userIds])) });
        }
        else
            usersNoProfiles = yield userRepo.find();
        for (const user of usersNoProfiles) {
            yield profile.save({
                userId: user.id,
                fullName: user.username
            });
        }
        myConsoleSuccess_1.myConsoleSuccess("usersNoProfiles: " + usersNoProfiles.length);
    }
    catch (e) {
        myConsoleError_1.myConsoleError(e.message);
    }
});
exports.createProfileForUsers = createProfileForUsers;
//# sourceMappingURL=createProfileForAll.js.map