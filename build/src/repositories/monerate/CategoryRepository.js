"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Category_1 = require("../../entities/monerate/Category");
let CategoryRepository = class CategoryRepository extends typeorm_1.Repository {
    async getCategoriesFromUser(user) {
        return this.find({ userId: user.id });
    }
    async saveCategoryPostDto(category, user) {
        return this.save({
            user: user,
            userId: user.id,
            name: category.name,
            bgColor: category.bgColor,
            icon: category.icon
        });
    }
};
CategoryRepository = __decorate([
    typeorm_1.EntityRepository(Category_1.default)
], CategoryRepository);
exports.default = CategoryRepository;
//# sourceMappingURL=CategoryRepository.js.map