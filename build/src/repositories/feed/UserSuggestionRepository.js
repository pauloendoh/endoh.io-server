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
const UserSuggestion_1 = require("../../entities/feed/UserSuggestion");
let UserSuggestionRepository = class UserSuggestionRepository extends typeorm_1.Repository {
    getUserSuggestions(forUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query(`
        	select sug."id",
          		   sug."suggestedUserId",
          		   sug."description", 
          		   usu."username",
          		   pro."fullName",
          		   pro."pictureUrl"
        	  from "user_suggestion" 	sug 
      inner join "user" 				    usu on usu.id = sug."suggestedUserId"
      inner join "profile"			    pro on pro."userId" = usu."id"
           where sug."userId" = $1
        order by sug."id"`, [forUser.id]);
        });
    }
};
UserSuggestionRepository = __decorate([
    typeorm_1.EntityRepository(UserSuggestion_1.UserSuggestion)
], UserSuggestionRepository);
exports.default = UserSuggestionRepository;
//# sourceMappingURL=UserSuggestionRepository.js.map