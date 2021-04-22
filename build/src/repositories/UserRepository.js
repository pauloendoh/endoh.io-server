"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
let UserRepository = class UserRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.saveAndGetRelations = (user) => __awaiter(this, void 0, void 0, function* () {
            const savedUser = yield this.save(user);
            return this.findOne({ where: { id: savedUser.id }, relations: ['preference'] });
        });
    }
    getAvailableUsernameByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailArr = email.split('@');
            if (emailArr.length === 1) {
                throw Error("Invalid email");
            }
            const username = emailArr[0];
            const user = yield this.findOne({ username });
            if (!user) {
                return username;
            }
            let foundAvailableUsername = false;
            let i = 0;
            while (!foundAvailableUsername) {
                const tryUsername = username + i;
                const tryUser = yield this.findOne({ username: tryUsername });
                if (!tryUser) {
                    foundAvailableUsername = true;
                    return tryUsername;
                }
                i++;
            }
        });
    }
    getTemporaryUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createQueryBuilder("user")
                .where("user.expiresAt IS NOT NULL")
                .getMany();
        });
    }
    getAvailableTempUsername() {
        return __awaiter(this, void 0, void 0, function* () {
            const tempUsers = yield this.getTemporaryUsers();
            let foundAvailable = false;
            let i = tempUsers.length;
            while (!foundAvailable) {
                const tryUsername = 'temp_user_' + i;
                const tryUser = yield this.findOne({ username: tryUsername });
                if (!tryUser) {
                    foundAvailable = true;
                    return tryUsername;
                }
                i++;
            }
        });
    }
    // wow, this seems dangerous haha :D 
    deleteExpiredTempUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createQueryBuilder("user")
                .delete()
                .where('"expiresAt" < NOW()')
                .execute();
        });
    }
    getUsersByText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query(`
    select use."id" 		as "userId",
		   use."email",
		   pro."fullName",
		   use."username",
		   pro."bio",
		   pro."pictureUrl"
	  from "user" use
inner join profile pro on pro."userId" = use."id"
     where use."username" ilike '%${text}%'
	    or use."email"	  ilike '%${text}%'
		or pro."fullName" ilike '%${text}%'`);
        });
    }
};
UserRepository = __decorate([
    typeorm_1.EntityRepository(User_1.User)
], UserRepository);
exports.default = UserRepository;
//# sourceMappingURL=UserRepository.js.map