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
exports.DecisionTable = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../User");
const Decision_1 = require("./Decision");
const DecisionTableItem_1 = require("./DecisionTableItem");
let DecisionTable = class DecisionTable {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], DecisionTable.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User, (user) => user.decisionTables, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", User_1.User)
], DecisionTable.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DecisionTable.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => Decision_1.Decision, (decision) => decision.tables, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Decision_1.Decision)
], DecisionTable.prototype, "decision", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DecisionTable.prototype, "decisionId", void 0);
__decorate([
    typeorm_1.OneToMany(() => DecisionTableItem_1.DecisionTableItem, (item) => item.decisionTable),
    __metadata("design:type", Array)
], DecisionTable.prototype, "items", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DecisionTable.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], DecisionTable.prototype, "index", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], DecisionTable.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", String)
], DecisionTable.prototype, "updatedAt", void 0);
DecisionTable = __decorate([
    typeorm_1.Entity()
], DecisionTable);
exports.DecisionTable = DecisionTable;
