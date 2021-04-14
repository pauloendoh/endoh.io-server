"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Resource_1 = require("../../entities/relearn/Resource");
let ResourceRepository = class ResourceRepository extends typeorm_1.Repository {
    // PE 2/3 
    getAllResourcesFromUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this
                .createQueryBuilder("resource")
                .where({ user })
                .leftJoinAndSelect('resource.tag', 'tag')
                .orderBy("resource.position", "ASC")
                .getMany();
        });
    }
    // PE 2/3 
    getRatedResourcesFromUser(user, allResources) {
        return __awaiter(this, void 0, void 0, function* () {
            if (allResources) {
                return this
                    .createQueryBuilder("resource")
                    .leftJoinAndSelect('resource.tag', 'tag')
                    .where({ user })
                    .andWhere("resource.rating > 0")
                    .andWhere("resource.\"tagId\" is not null")
                    .orderBy("resource.completedAt", "DESC")
                    .getMany();
            }
            else {
                return this
                    .createQueryBuilder("resource")
                    .leftJoinAndSelect('resource.tag', 'tag')
                    .where({ user })
                    .andWhere("resource.rating > 0")
                    .andWhere("resource.\"tagId\" is not null")
                    .andWhere("tag.\"isPrivate\" is false") // get only the public resources (from public tags, that is)
                    .orderBy("resource.completedAt", "DESC")
                    .getMany();
            }
        });
    }
    getLastPosition(tag, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let lastResource;
            if (tag) {
                lastResource = yield this
                    .createQueryBuilder('resource')
                    .where({ tag })
                    .andWhere("resource.position IS NOT NULL")
                    .orderBy('resource.position', 'DESC')
                    .getOne();
            }
            else {
                lastResource = yield this.createQueryBuilder('resource')
                    .where({ user })
                    .andWhere("resource.tagId IS NULL")
                    .andWhere("resource.position IS NOT NULL")
                    .orderBy('resource.position', 'DESC')
                    .getOne();
            }
            if ((lastResource === null || lastResource === void 0 ? void 0 : lastResource.position) >= 0) {
                return lastResource.position + 1;
            }
            return 0;
        });
    }
    // reduce by 1 
    reducePosition(tag, user, startingPosition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tag) {
                yield typeorm_1.getManager().query(`
                UPDATE "resource" 
                   SET "position" = "position" - 1 
                 WHERE "tagId" = $1 
                   AND "position" >= $2`, [tag.id, startingPosition]);
            }
            else {
                yield typeorm_1.getManager().query(`
                UPDATE "resource" 
                   SET "position" = "position" - 1 
                 WHERE "tagId" IS NULL 
                   AND "userId" = $1 
                   AND "position" >= $2`, [user.id, startingPosition]);
            }
        });
    }
    // reduce by 1 
    increasePositionByOne(tagId, user, startingPosition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tagId) {
                yield typeorm_1.getManager().query(`
                UPDATE "resource" 
                   SET "position" = "position" + 1 
                 WHERE "tagId" = $1 
                   AND "position" >= $2`, [tagId, startingPosition]);
            }
            else {
                yield typeorm_1.getManager().query(`
                UPDATE "resource" 
                   SET "position" = "position" + 1 
                 WHERE "tagId" IS NULL 
                   AND "userId" = $1 
                   AND "position" >= $2`, [user.id, startingPosition]);
            }
        });
    }
    // PE 2/3 
    getResourcesByText(user, text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this
                .createQueryBuilder("resource")
                .where({ user })
                .andWhere("resource.title ilike :text or resource.url like :text", { text: `%${text}%` })
                .leftJoinAndSelect('resource.tag', 'tag')
                .orderBy("resource.position", "ASC")
                .getMany();
        });
    }
};
ResourceRepository = __decorate([
    typeorm_1.EntityRepository(Resource_1.Resource)
], ResourceRepository);
exports.default = ResourceRepository;
//# sourceMappingURL=ResourceRepository.js.map