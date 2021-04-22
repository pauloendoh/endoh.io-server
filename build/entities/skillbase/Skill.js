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
var Skill_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
const typeorm_1 = require("typeorm");
const Tag_1 = require("../relearn/Tag");
const User_1 = require("../User");
const SkillProgress_1 = require("./SkillProgress");
let Skill = Skill_1 = class Skill {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Skill.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.skills, { onDelete: "CASCADE" }),
    __metadata("design:type", User_1.User)
], Skill.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Skill.prototype, "userId", void 0);
__decorate([
    typeorm_1.OneToMany(type => SkillProgress_1.SkillProgress, progress => progress.skill),
    __metadata("design:type", Array)
], Skill.prototype, "progresses", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Skill_1, skill => skill.childDependencies),
    typeorm_1.JoinTable({
        name: "skill_dependency",
        joinColumn: {
            name: "skillId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "dependencyId",
            referencedColumnName: "id"
        },
    }),
    __metadata("design:type", Array)
], Skill.prototype, "dependencies", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Skill_1, skill => skill.dependencies),
    __metadata("design:type", Array)
], Skill.prototype, "childDependencies", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Tag_1.Tag, tag => tag.skills, { onDelete: "SET NULL" }),
    __metadata("design:type", Tag_1.Tag)
], Skill.prototype, "tag", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Skill.prototype, "tagId", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Skill.prototype, "isPriority", void 0);
__decorate([
    typeorm_1.Column({ default: '' }),
    __metadata("design:type", String)
], Skill.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Skill.prototype, "currentLevel", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Skill.prototype, "goalLevel", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], Skill.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", String)
], Skill.prototype, "updatedAt", void 0);
Skill = Skill_1 = __decorate([
    typeorm_1.Entity()
], Skill);
exports.Skill = Skill;
