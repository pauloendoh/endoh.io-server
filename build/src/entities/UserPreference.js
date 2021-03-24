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
exports.UserPreference = void 0;
var typeorm_1 = require("typeorm");
var User_1 = require("./User");
var UserPreference = /** @class */ (function () {
    function UserPreference() {
        this.id = null;
        this.relearnAutofillURL = true;
        this.relearnLastAccessedRoute = '/';
        this.skillbaseSidebarIsOpen = false;
        this.skillbaseSortSkill = null;
        this.skillbaseTextFilter = "";
        this.createdAt = new Date();
        this.updatedAt = new Date();
        return this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], UserPreference.prototype, "id", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return User_1.User; }, function (user) { return user.preference; }, { onDelete: "CASCADE" }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", User_1.User)
    ], UserPreference.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column({ default: true }),
        __metadata("design:type", Boolean)
    ], UserPreference.prototype, "relearnAutofillURL", void 0);
    __decorate([
        typeorm_1.Column({ default: "/" }),
        __metadata("design:type", String)
    ], UserPreference.prototype, "relearnLastAccessedRoute", void 0);
    __decorate([
        typeorm_1.Column({ default: false }),
        __metadata("design:type", Boolean)
    ], UserPreference.prototype, "skillbaseSidebarIsOpen", void 0);
    __decorate([
        typeorm_1.Column({ type: "simple-json", nullable: true }),
        __metadata("design:type", Object)
    ], UserPreference.prototype, "skillbaseSortSkill", void 0);
    __decorate([
        typeorm_1.Column({ default: "" }),
        __metadata("design:type", String)
    ], UserPreference.prototype, "skillbaseTextFilter", void 0);
    __decorate([
        typeorm_1.CreateDateColumn(),
        __metadata("design:type", Date)
    ], UserPreference.prototype, "createdAt", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn(),
        __metadata("design:type", Date)
    ], UserPreference.prototype, "updatedAt", void 0);
    UserPreference = __decorate([
        typeorm_1.Entity(),
        __metadata("design:paramtypes", [])
    ], UserPreference);
    return UserPreference;
}());
exports.UserPreference = UserPreference;
//# sourceMappingURL=UserPreference.js.map