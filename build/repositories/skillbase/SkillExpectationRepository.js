"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const SkillExpectation_1 = require("../../entities/skillbase/SkillExpectation");
let SkillExpectationRepository = class SkillExpectationRepository extends typeorm_1.Repository {
    async createExpectationsForNewUser(user, skills) {
        const jsSkill = skills[0];
        const lolSkill = skills[1];
        const expectations = [];
        expectations.push(await this.save({
            user,
            skill: jsSkill,
            level: 4,
            index: 0,
            description: "Learn TypeScript",
            checked: false,
        }));
        expectations.push(await this.save({
            user,
            skill: jsSkill,
            level: 3,
            index: 0,
            description: "Learn filter(), map(), slice() and splice()",
            checked: true,
        }));
        expectations.push(await this.save({
            user,
            skill: lolSkill,
            level: 10,
            index: 0,
            description: "Be at Faker and Dopa level",
            checked: false,
        }));
        expectations.push(await this.save({
            user,
            skill: lolSkill,
            level: 1,
            index: 0,
            description: "Turn on your monitor",
            checked: true,
        }));
        expectations.push(await this.save({
            user,
            skill: lolSkill,
            level: 7,
            index: 0,
            description: "Learn about 🌊 management",
            checked: false,
        }));
        return [];
    }
};
SkillExpectationRepository = __decorate([
    typeorm_1.EntityRepository(SkillExpectation_1.SkillExpectation)
], SkillExpectationRepository);
exports.default = SkillExpectationRepository;
