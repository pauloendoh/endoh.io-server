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
exports.Expense = void 0;
var typeorm_1 = require("typeorm");
var User_1 = require("../User");
var Category_1 = require("./Category");
var Place_1 = require("./Place");
var Expense = /** @class */ (function () {
    function Expense() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Expense.prototype, "id", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, function (user) { return user.expenses; }, { onDelete: "CASCADE" }),
        __metadata("design:type", User_1.User)
    ], Expense.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Expense.prototype, "userId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Expense.prototype, "description", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Expense.prototype, "name", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], Expense.prototype, "rating", void 0);
    __decorate([
        typeorm_1.Column("double precision", { nullable: true }),
        __metadata("design:type", Number)
    ], Expense.prototype, "value", void 0);
    __decorate([
        typeorm_1.CreateDateColumn(),
        __metadata("design:type", String)
    ], Expense.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn(),
        __metadata("design:type", String)
    ], Expense.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Place_1.default; }, function (place) { return place.expenses; }, { nullable: true, onDelete: 'SET NULL' }),
        __metadata("design:type", Place_1.default)
    ], Expense.prototype, "place", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], Expense.prototype, "placeId", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return Category_1.default; }, function (category) { return category.expenses; }, { nullable: true, onDelete: 'SET NULL' }),
        __metadata("design:type", Category_1.default)
    ], Expense.prototype, "category", void 0);
    __decorate([
        typeorm_1.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], Expense.prototype, "categoryId", void 0);
    Expense = __decorate([
        typeorm_1.Entity()
    ], Expense);
    return Expense;
}());
exports.Expense = Expense;
//# sourceMappingURL=Expense.js.map