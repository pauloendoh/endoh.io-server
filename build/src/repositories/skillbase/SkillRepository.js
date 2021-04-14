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
const Skill_1 = require("../../entities/skillbase/Skill");
let SkillRepository = class SkillRepository extends typeorm_1.Repository {
    getAllFromUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createQueryBuilder("skill")
                .where({ userId: userId })
                .leftJoinAndSelect('skill.dependencies', 'dependencies')
                .orderBy("skill.isPriority", "DESC")
                .addOrderBy("skill.goalLevel", "DESC")
                .addOrderBy("skill.currentLevel", "DESC")
                .getMany();
        });
    }
    deleteIdsFromUser(ids, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createQueryBuilder("skill")
                .delete()
                .where({ userId: userId })
                .andWhere("skill.id IN (:...ids)", { ids: [...ids] })
                .execute();
        });
    }
    getByText(userId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createQueryBuilder("skill")
                .where({ userId: userId })
                .andWhere("skill.name ilike :text", { text: `%${text}%` })
                .leftJoinAndSelect('skill.dependencies', 'dependencies')
                .orderBy("skill.isPriority", "DESC")
                .addOrderBy("skill.goalLevel", "DESC")
                .addOrderBy("skill.currentLevel", "DESC")
                .getMany();
        });
    }
};
SkillRepository = __decorate([
    typeorm_1.EntityRepository(Skill_1.Skill)
], SkillRepository);
exports.default = SkillRepository;
//# sourceMappingURL=SkillRepository.js.map