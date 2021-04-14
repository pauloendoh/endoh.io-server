"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1618347346939 = void 0;
class Migration1618347346939 {
    constructor() {
        this.name = 'Migration1618347346939';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggPick" numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggWin" numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggAvg" numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsPick" numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsWin" numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsAvg" numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsPick" numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsWin" numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsAvg" numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzPick" numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzWin" numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzAvg" numeric`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzAvg" integer`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzWin" integer`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzPick" integer`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsAvg" integer`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsWin" integer`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsPick" integer`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsAvg" integer`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsWin" integer`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsPick" integer`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggAvg" integer`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggWin" integer`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggPick" integer`);
    }
}
exports.Migration1618347346939 = Migration1618347346939;
//# sourceMappingURL=1618347346939-Migration.js.map