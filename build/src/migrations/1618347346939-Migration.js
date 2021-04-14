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
exports.Migration1618347346939 = void 0;
class Migration1618347346939 {
    constructor() {
        this.name = 'Migration1618347346939';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggPick"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggPick" numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggWin"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggWin" numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggAvg"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggAvg" numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsPick"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsPick" numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsWin"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsWin" numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsAvg"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsAvg" numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsPick"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsPick" numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsWin"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsWin" numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsAvg"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsAvg" numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzPick"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzPick" numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzWin"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzWin" numeric`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzAvg"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzAvg" numeric`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzAvg"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzAvg" integer`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzWin"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzWin" integer`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzPick"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzPick" integer`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsAvg"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsAvg" integer`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsWin"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsWin" integer`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsPick"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsPick" integer`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsAvg"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsAvg" integer`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsWin"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsWin" integer`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsPick"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsPick" integer`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggAvg"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggAvg" integer`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggWin"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggWin" integer`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggPick"`);
            yield queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggPick" integer`);
        });
    }
}
exports.Migration1618347346939 = Migration1618347346939;
//# sourceMappingURL=1618347346939-Migration.js.map