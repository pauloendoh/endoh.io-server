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
const LolRate_1 = require("../entities/LolRate");
const myConsoleError_1 = require("../utils/myConsoleError");
let LolRateRepository = class LolRateRepository extends typeorm_1.Repository {
    saveChampions(champions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const champion of champions) {
                    const { name: championName, iconUrl } = champion;
                    const exists = yield this.findOne({
                        where: { championName, iconUrl }
                    });
                    if (!exists) {
                        const roles = ["TOP", "JUNGLE", "MID", "BOT", "SUP"];
                        for (const role of roles) {
                            yield this.save({ championName, iconUrl, role });
                        }
                    }
                }
                return this.find();
            }
            catch (err) {
                myConsoleError_1.myConsoleError(err.message);
            }
        });
    }
    saveOpgg(results) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(results);
            try {
                // resetting all from op.gg
                yield this.createQueryBuilder()
                    .update()
                    .set({
                    opggPick: null,
                    opggWin: null,
                    opggAvg: null,
                    opggUpdatedAt: new Date().toISOString()
                })
                    .execute();
                for (const { role, championName, pickRate, winRate } of results) {
                    const opggPick = Number(pickRate.trim().replace(/%/g, ''));
                    const opggWin = Number(winRate.trim().replace(/%/g, ''));
                    const opggAvg = Number((opggPick + opggWin) / 2);
                    yield this.createQueryBuilder()
                        .update()
                        .set({
                        opggPick,
                        opggWin,
                        opggAvg,
                        opggUpdatedAt: new Date().toISOString()
                    })
                        .where("championName = :championName", { championName })
                        .andWhere("role = :role", { role }).execute();
                }
            }
            catch (err) {
                myConsoleError_1.myConsoleError(err.message);
            }
        });
    }
    saveLolGraphs(results) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(results);
            try {
                // resetting all from op.gg
                yield this.createQueryBuilder()
                    .update()
                    .set({
                    lolgraphsPick: null,
                    lolgraphsWin: null,
                    lolgraphsAvg: null,
                    lolgraphsUpdatedAt: new Date().toISOString()
                })
                    .execute();
                for (const { role, championName, pickRate, winRate } of results) {
                    const lolgraphsPick = Number(pickRate.trim().replace(/%/g, ''));
                    const lolgraphsWin = Number(winRate.trim().replace(/%/g, ''));
                    const lolgraphsAvg = Number((lolgraphsPick + lolgraphsWin) / 2);
                    yield this.createQueryBuilder()
                        .update()
                        .set({
                        lolgraphsPick,
                        lolgraphsWin,
                        lolgraphsAvg,
                        lolgraphsUpdatedAt: new Date().toISOString()
                    })
                        .where("championName = :championName", { championName })
                        .andWhere("role = :role", { role }).execute();
                }
            }
            catch (err) {
                myConsoleError_1.myConsoleError(err.message);
            }
        });
    }
};
LolRateRepository = __decorate([
    typeorm_1.EntityRepository(LolRate_1.LolRate)
], LolRateRepository);
exports.default = LolRateRepository;
//# sourceMappingURL=LolRateRepository.js.map