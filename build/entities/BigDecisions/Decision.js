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
exports.Decision = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../User");
const DecisionTable_1 = require("./DecisionTable");
let Decision = class Decision {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Decision.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User, (user) => user.decisions, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", User_1.User)
], Decision.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Decision.prototype, "userId", void 0);
__decorate([
    typeorm_1.OneToMany(() => DecisionTable_1.DecisionTable, (table) => table.decision),
    __metadata("design:type", Array)
], Decision.prototype, "tables", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Decision.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], Decision.prototype, "isPriority", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], Decision.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", String)
], Decision.prototype, "updatedAt", void 0);
Decision = __decorate([
    typeorm_1.Entity()
], Decision);
exports.Decision = Decision;
