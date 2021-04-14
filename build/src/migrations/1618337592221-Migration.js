"use strict";
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
exports.Migration1618337592221 = void 0;
class Migration1618337592221 {
    constructor() {
        this.name = 'Migration1618337592221';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "lol_rates" ("id" SERIAL NOT NULL, "championName" character varying NOT NULL, "iconUrl" character varying NOT NULL, "opggPick" integer, "opggWin" integer, "opggAvg" integer, "opggUpdatedAt" character varying, "lolgraphsPick" integer, "lolgraphsWin" integer, "lolgraphsAvg" integer, "lolgraphsUpdatedAt" character varying, "lolalyticsPick" integer, "lolalyticsWin" integer, "lolalyticsAvg" integer, "lolalyticsUpdatedAt" character varying, "blitzPick" integer, "blitzWin" integer, "blitzAvg" integer, "blitzUpdatedAt" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bdb5ff946c5099459d4fa993dde" PRIMARY KEY ("id"))`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`DROP TABLE "lol_rates"`);
        });
    }
}
exports.Migration1618337592221 = Migration1618337592221;
//# sourceMappingURL=1618337592221-Migration.js.map