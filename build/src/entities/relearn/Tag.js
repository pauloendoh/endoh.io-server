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
exports.Tag = void 0;
var typeorm_1 = require("typeorm");
var FollowingTag_1 = require("../feed/FollowingTag");
var Skill_1 = require("../skillbase/Skill");
var User_1 = require("../User");
var Resource_1 = require("./Resource");
var Tag = /** @class */ (function () {
    function Tag() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Tag.prototype, "id", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, function (user) { return user.tags; }, { onDelete: "CASCADE" }),
        __metadata("design:type", User_1.User)
    ], Tag.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Tag.prototype, "userId", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Resource_1.Resource; }, function (resource) { return resource.tag; }),
        __metadata("design:type", Array)
    ], Tag.prototype, "resources", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Skill_1.Skill; }, function (skill) { return skill.tag; }),
        __metadata("design:type", Array)
    ], Tag.prototype, "skills", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return FollowingTag_1.FollowingTag; }, function (tagFollower) { return tagFollower.tag; }),
        __metadata("design:type", Array)
    ], Tag.prototype, "tagFollowers", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Tag.prototype, "name", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], Tag.prototype, "position", void 0);
    __decorate([
        typeorm_1.Column({ default: "#ffffff" }),
        __metadata("design:type", String)
    ], Tag.prototype, "color", void 0);
    __decorate([
        typeorm_1.Column({ default: false }),
        __metadata("design:type", Boolean)
    ], Tag.prototype, "isPrivate", void 0);
    __decorate([
        typeorm_1.CreateDateColumn(),
        __metadata("design:type", String)
    ], Tag.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn(),
        __metadata("design:type", String)
    ], Tag.prototype, "updatedAt", void 0);
    Tag = __decorate([
        typeorm_1.Entity()
    ], Tag);
    return Tag;
}());
exports.Tag = Tag;
//# sourceMappingURL=Tag.js.map