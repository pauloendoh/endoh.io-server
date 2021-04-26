"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillExpectation = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../User");
const Skill_1 = require("./Skill");
let SkillExpectation = class SkillExpectation {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], SkillExpectation.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User, (user) => user.skillExpectations, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", User_1.User)
], SkillExpectation.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], SkillExpectation.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => Skill_1.Skill, (skill) => skill.expectations, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Skill_1.Skill)
], SkillExpectation.prototype, "skill", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], SkillExpectation.prototype, "skillId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], SkillExpectation.prototype, "level", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], SkillExpectation.prototype, "index", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SkillExpectation.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], SkillExpectation.prototype, "checked", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], SkillExpectation.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", String)
], SkillExpectation.prototype, "updatedAt", void 0);
SkillExpectation = __decorate([
    typeorm_1.Entity()
], SkillExpectation);
exports.SkillExpectation = SkillExpectation;
