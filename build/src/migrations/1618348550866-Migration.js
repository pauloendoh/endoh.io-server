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
exports.Migration1618348550866 = void 0;
class Migration1618348550866 {
    constructor() {
        this.name = 'Migration1618348550866';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "opggPick" TYPE numeric(5,2)`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "opggWin" TYPE numeric(5,2)`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "opggAvg" TYPE numeric(5,2)`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolgraphsPick" TYPE numeric(5,2)`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolgraphsWin" TYPE numeric(5,2)`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolgraphsAvg" TYPE numeric(5,2)`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolalyticsPick" TYPE numeric(5,2)`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolalyticsWin" TYPE numeric(5,2)`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolalyticsAvg" TYPE numeric(5,2)`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "blitzPick" TYPE numeric(5,2)`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "blitzWin" TYPE numeric(5,2)`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "blitzAvg" TYPE numeric(5,2)`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "blitzAvg" TYPE numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "blitzWin" TYPE numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "blitzPick" TYPE numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolalyticsAvg" TYPE numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolalyticsWin" TYPE numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolalyticsPick" TYPE numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolgraphsAvg" TYPE numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolgraphsWin" TYPE numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolgraphsPick" TYPE numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "opggAvg" TYPE numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "opggWin" TYPE numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "opggPick" TYPE numeric`);
        });
    }
}
exports.Migration1618348550866 = Migration1618348550866;
//# sourceMappingURL=1618348550866-Migration.js.map