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
exports.DecisionTableItem = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../User");
const DecisionTable_1 = require("./DecisionTable");
let DecisionTableItem = class DecisionTableItem {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], DecisionTableItem.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User, (user) => user.decisionTables, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", User_1.User)
], DecisionTableItem.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DecisionTableItem.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => DecisionTable_1.DecisionTable, (table) => table.items, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", DecisionTable_1.DecisionTable)
], DecisionTableItem.prototype, "decisionTable", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DecisionTableItem.prototype, "decisionTableId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], DecisionTableItem.prototype, "index", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DecisionTableItem.prototype, "problem", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DecisionTableItem.prototype, "solution", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], DecisionTableItem.prototype, "weight", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], DecisionTableItem.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", String)
], DecisionTableItem.prototype, "updatedAt", void 0);
DecisionTableItem = __decorate([
    typeorm_1.Entity()
], DecisionTableItem);
exports.DecisionTableItem = DecisionTableItem;
