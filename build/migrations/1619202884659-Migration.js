"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1619202884659 = void 0;
class Migration1619202884659 {
    constructor() {
        this.name = 'Migration1619202884659';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggPick" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggWin" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggAvg" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsPick" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsWin" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsAvg" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsPick" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsWin" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsAvg" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzPick" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzWin" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzAvg" double precision`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzAvg" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzWin" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "blitzPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "blitzPick" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsAvg" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsWin" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolalyticsPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolalyticsPick" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsAvg" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsWin" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "lolgraphsPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "lolgraphsPick" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggAvg" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggWin" numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "opggPick"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "opggPick" numeric(5,2)`);
    }
}
exports.Migration1619202884659 = Migration1619202884659;
