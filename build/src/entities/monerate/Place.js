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
var typeorm_1 = require("typeorm");
var User_1 = require("../User");
var Expense_1 = require("./Expense");
var Place = /** @class */ (function () {
    function Place() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Place.prototype, "id", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, function (user) { return user.places; }, { onDelete: "CASCADE" }),
        __metadata("design:type", User_1.User)
    ], Place.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Place.prototype, "userId", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Place.prototype, "name", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Place.prototype, "icon", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Place.prototype, "bgColor", void 0);
    __decorate([
        typeorm_1.CreateDateColumn(),
        __metadata("design:type", String)
    ], Place.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn(),
        __metadata("design:type", String)
    ], Place.prototype, "updatedAt", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return Expense_1.Expense; }, function (expense) { return expense.place; }, { onDelete: 'CASCADE' }),
        __metadata("design:type", Array)
    ], Place.prototype, "expenses", void 0);
    Place = __decorate([
        typeorm_1.Entity()
    ], Place);
    return Place;
}());
exports.default = Place;
//# sourceMappingURL=Place.js.map