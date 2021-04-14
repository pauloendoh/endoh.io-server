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
exports.UserSuggestion = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../User");
let UserSuggestion = class UserSuggestion {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], UserSuggestion.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.userSuggestions, { onDelete: "CASCADE" }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", User_1.User)
], UserSuggestion.prototype, "user", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserSuggestion.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.suggestedBy, { onDelete: "CASCADE" }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", User_1.User)
], UserSuggestion.prototype, "suggestedUser", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], UserSuggestion.prototype, "suggestedUserId", void 0);
__decorate([
    typeorm_1.Column({ default: '' }),
    __metadata("design:type", String)
], UserSuggestion.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ default: '' }),
    __metadata("design:type", String)
], UserSuggestion.prototype, "dontShowUntil", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], UserSuggestion.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], UserSuggestion.prototype, "updatedAt", void 0);
UserSuggestion = __decorate([
    typeorm_1.Entity()
], UserSuggestion);
exports.UserSuggestion = UserSuggestion;
//# sourceMappingURL=UserSuggestion.js.map