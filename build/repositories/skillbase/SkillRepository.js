"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Skill_1 = require("../../entities/skillbase/Skill");
let SkillRepository = class SkillRepository extends typeorm_1.Repository {
    async getAllFromUser(userId) {
        return this.createQueryBuilder("skill")
            .where({ userId: userId })
            .leftJoinAndSelect('skill.dependencies', 'dependencies')
            .orderBy("skill.isPriority", "DESC")
            .addOrderBy("skill.goalLevel", "DESC")
            .addOrderBy("skill.currentLevel", "DESC")
            .getMany();
    }
    async deleteIdsFromUser(ids, userId) {
        return this.createQueryBuilder("skill")
            .delete()
            .where({ userId: userId })
            .andWhere("skill.id IN (:...ids)", { ids: [...ids] })
            .execute();
    }
    async getByText(userId, text) {
        return this.createQueryBuilder("skill")
            .where({ userId: userId })
            .andWhere("skill.name ilike :text", { text: `%${text}%` })
            .leftJoinAndSelect('skill.dependencies', 'dependencies')
            .orderBy("skill.isPriority", "DESC")
            .addOrderBy("skill.goalLevel", "DESC")
            .addOrderBy("skill.currentLevel", "DESC")
            .getMany();
    }
};
SkillRepository = __decorate([
    typeorm_1.EntityRepository(Skill_1.Skill)
], SkillRepository);
exports.default = SkillRepository;
//# sourceMappingURL=SkillRepository.js.map