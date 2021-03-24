"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var Resource_1 = require("../../entities/relearn/Resource");
var ResourceRepository = /** @class */ (function (_super) {
    __extends(ResourceRepository, _super);
    function ResourceRepository() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // PE 2/3 
    ResourceRepository.prototype.getAllResourcesFromUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this
                        .createQueryBuilder("resource")
                        .where({ user: user })
                        .leftJoinAndSelect('resource.tag', 'tag')
                        .orderBy("resource.position", "ASC")
                        .getMany()];
            });
        });
    };
    // PE 2/3 
    ResourceRepository.prototype.getRatedResourcesFromUser = function (user, allResources) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (allResources) {
                    return [2 /*return*/, this
                            .createQueryBuilder("resource")
                            .leftJoinAndSelect('resource.tag', 'tag')
                            .where({ user: user })
                            .andWhere("resource.rating > 0")
                            .andWhere("resource.\"tagId\" is not null")
                            .orderBy("resource.completedAt", "DESC")
                            .getMany()];
                }
                else {
                    return [2 /*return*/, this
                            .createQueryBuilder("resource")
                            .leftJoinAndSelect('resource.tag', 'tag')
                            .where({ user: user })
                            .andWhere("resource.rating > 0")
                            .andWhere("resource.\"tagId\" is not null")
                            .andWhere("tag.\"isPrivate\" is false") // get only the public resources (from public tags, that is)
                            .orderBy("resource.completedAt", "DESC")
                            .getMany()];
                }
                return [2 /*return*/];
            });
        });
    };
    ResourceRepository.prototype.getLastPosition = function (tag, user) {
        return __awaiter(this, void 0, void 0, function () {
            var lastResource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!tag) return [3 /*break*/, 2];
                        return [4 /*yield*/, this
                                .createQueryBuilder('resource')
                                .where({ tag: tag })
                                .andWhere("resource.position IS NOT NULL")
                                .orderBy('resource.position', 'DESC')
                                .getOne()];
                    case 1:
                        lastResource = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.createQueryBuilder('resource')
                            .where({ user: user })
                            .andWhere("resource.tagId IS NULL")
                            .andWhere("resource.position IS NOT NULL")
                            .orderBy('resource.position', 'DESC')
                            .getOne()];
                    case 3:
                        lastResource = _a.sent();
                        _a.label = 4;
                    case 4:
                        if ((lastResource === null || lastResource === void 0 ? void 0 : lastResource.position) >= 0) {
                            return [2 /*return*/, lastResource.position + 1];
                        }
                        return [2 /*return*/, 0];
                }
            });
        });
    };
    // reduce by 1 
    ResourceRepository.prototype.reducePosition = function (tag, user, startingPosition) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!tag) return [3 /*break*/, 2];
                        return [4 /*yield*/, typeorm_1.getManager().query("\n                UPDATE \"resource\" \n                   SET \"position\" = \"position\" - 1 \n                 WHERE \"tagId\" = $1 \n                   AND \"position\" >= $2", [tag.id, startingPosition])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, typeorm_1.getManager().query("\n                UPDATE \"resource\" \n                   SET \"position\" = \"position\" - 1 \n                 WHERE \"tagId\" IS NULL \n                   AND \"userId\" = $1 \n                   AND \"position\" >= $2", [user.id, startingPosition])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // reduce by 1 
    ResourceRepository.prototype.increasePositionByOne = function (tagId, user, startingPosition) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!tagId) return [3 /*break*/, 2];
                        return [4 /*yield*/, typeorm_1.getManager().query("\n                UPDATE \"resource\" \n                   SET \"position\" = \"position\" + 1 \n                 WHERE \"tagId\" = $1 \n                   AND \"position\" >= $2", [tagId, startingPosition])];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, typeorm_1.getManager().query("\n                UPDATE \"resource\" \n                   SET \"position\" = \"position\" + 1 \n                 WHERE \"tagId\" IS NULL \n                   AND \"userId\" = $1 \n                   AND \"position\" >= $2", [user.id, startingPosition])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // PE 2/3 
    ResourceRepository.prototype.getResourcesByText = function (user, text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this
                        .createQueryBuilder("resource")
                        .where({ user: user })
                        .andWhere("resource.title ilike :text or resource.url like :text", { text: "%" + text + "%" })
                        .leftJoinAndSelect('resource.tag', 'tag')
                        .orderBy("resource.position", "ASC")
                        .getMany()];
            });
        });
    };
    ResourceRepository = __decorate([
        typeorm_1.EntityRepository(Resource_1.Resource)
    ], ResourceRepository);
    return ResourceRepository;
}(typeorm_1.Repository));
exports.default = ResourceRepository;
//# sourceMappingURL=ResourceRepository.js.map