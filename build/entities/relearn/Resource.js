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
exports.Resource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../User");
const Tag_1 = require("./Tag");
let Resource = class Resource {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Resource.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.expenses, { onDelete: "CASCADE" }),
    __metadata("design:type", User_1.User)
], Resource.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Resource.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Resource.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Resource.prototype, "url", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Resource.prototype, "thumbnail", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Resource.prototype, "estimatedTime", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Resource.prototype, "dueDate", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Resource.prototype, "rating", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Resource.prototype, "completedAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Resource.prototype, "position", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Resource.prototype, "publicReview", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Resource.prototype, "privateNote", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], Resource.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", String)
], Resource.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Tag_1.Tag, tag => tag.resources, { onDelete: 'CASCADE' }),
    __metadata("design:type", Tag_1.Tag)
], Resource.prototype, "tag", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Resource.prototype, "tagId", void 0);
Resource = __decorate([
    typeorm_1.Entity()
], Resource);
exports.Resource = Resource;
