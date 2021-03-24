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
exports.Profile = void 0;
var typeorm_1 = require("typeorm");
var User_1 = require("../User");
var Profile = /** @class */ (function () {
    function Profile() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Profile.prototype, "id", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return User_1.User; }, function (user) { return user.preference; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", User_1.User)
    ], Profile.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Number)
    ], Profile.prototype, "userId", void 0);
    __decorate([
        typeorm_1.Column({ default: '' }),
        __metadata("design:type", String)
    ], Profile.prototype, "fullName", void 0);
    __decorate([
        typeorm_1.Column({ default: '' }),
        __metadata("design:type", String)
    ], Profile.prototype, "bio", void 0);
    __decorate([
        typeorm_1.Column({ default: '' }),
        __metadata("design:type", String)
    ], Profile.prototype, "pictureUrl", void 0);
    __decorate([
        typeorm_1.Column({ default: '' }),
        __metadata("design:type", String)
    ], Profile.prototype, "pictureName", void 0);
    __decorate([
        typeorm_1.Column({ default: '' }),
        __metadata("design:type", String)
    ], Profile.prototype, "website", void 0);
    __decorate([
        typeorm_1.CreateDateColumn(),
        __metadata("design:type", Date)
    ], Profile.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn(),
        __metadata("design:type", Date)
    ], Profile.prototype, "updatedAt", void 0);
    Profile = __decorate([
        typeorm_1.Entity()
    ], Profile);
    return Profile;
}());
exports.Profile = Profile;
//# sourceMappingURL=Profile.js.map