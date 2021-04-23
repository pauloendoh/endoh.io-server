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
exports.LolRate = void 0;
const typeorm_1 = require("typeorm");
let LolRate = class LolRate {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], LolRate.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], LolRate.prototype, "championName", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], LolRate.prototype, "iconUrl", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], LolRate.prototype, "role", void 0);
__decorate([
    typeorm_1.Column("double precision", { nullable: true }),
    __metadata("design:type", Number)
], LolRate.prototype, "opggPick", void 0);
__decorate([
    typeorm_1.Column("double precision", { nullable: true }),
    __metadata("design:type", Number)
], LolRate.prototype, "opggWin", void 0);
__decorate([
    typeorm_1.Column("double precision", { nullable: true }),
    __metadata("design:type", Number)
], LolRate.prototype, "opggAvg", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], LolRate.prototype, "opggUpdatedAt", void 0);
__decorate([
    typeorm_1.Column("double precision", { nullable: true }),
    __metadata("design:type", Number)
], LolRate.prototype, "lolgraphsPick", void 0);
__decorate([
    typeorm_1.Column("double precision", { nullable: true }),
    __metadata("design:type", Number)
], LolRate.prototype, "lolgraphsWin", void 0);
__decorate([
    typeorm_1.Column("double precision", { nullable: true }),
    __metadata("design:type", Number)
], LolRate.prototype, "lolgraphsAvg", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], LolRate.prototype, "lolgraphsUpdatedAt", void 0);
__decorate([
    typeorm_1.Column("double precision", { nullable: true }),
    __metadata("design:type", Number)
], LolRate.prototype, "lolalyticsPick", void 0);
__decorate([
    typeorm_1.Column("double precision", { nullable: true }),
    __metadata("design:type", Number)
], LolRate.prototype, "lolalyticsWin", void 0);
__decorate([
    typeorm_1.Column("double precision", { nullable: true }),
    __metadata("design:type", Number)
], LolRate.prototype, "lolalyticsAvg", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], LolRate.prototype, "lolalyticsUpdatedAt", void 0);
__decorate([
    typeorm_1.Column("double precision", { nullable: true }),
    __metadata("design:type", Number)
], LolRate.prototype, "blitzPick", void 0);
__decorate([
    typeorm_1.Column("double precision", { nullable: true }),
    __metadata("design:type", Number)
], LolRate.prototype, "blitzWin", void 0);
__decorate([
    typeorm_1.Column("double precision", { nullable: true }),
    __metadata("design:type", Number)
], LolRate.prototype, "blitzAvg", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], LolRate.prototype, "blitzUpdatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], LolRate.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", String)
], LolRate.prototype, "updatedAt", void 0);
LolRate = __decorate([
    typeorm_1.Entity()
], LolRate);
exports.LolRate = LolRate;
