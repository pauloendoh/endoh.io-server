"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Tag_1 = require("../../entities/relearn/Tag");
let TagRepository = class TagRepository extends typeorm_1.Repository {
    // PE 2/3
    async getAllTagsFromUser(user) {
        return this.createQueryBuilder("tag")
            .where({ user })
            .leftJoinAndSelect("tag.resources", "resources")
            .orderBy("tag.createdAt", "ASC")
            .getMany();
    }
    async createTagsForNewUser(user) {
        const tag1 = await this.save({
            user,
            name: "[Example] Programming",
            color: "#14aaf5",
        });
        const tag2 = await this.save({
            user,
            name: "[Example] Soft Skillls",
            color: "#6accbc",
            isPrivate: true,
        });
        return [tag1, tag2];
    }
};
TagRepository = __decorate([
    typeorm_1.EntityRepository(Tag_1.Tag)
], TagRepository);
exports.default = TagRepository;
