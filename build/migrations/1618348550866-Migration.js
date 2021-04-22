"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1618348550866 = void 0;
class Migration1618348550866 {
    constructor() {
        this.name = 'Migration1618348550866';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "opggPick" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "opggWin" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "opggAvg" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolgraphsPick" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolgraphsWin" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolgraphsAvg" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolalyticsPick" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolalyticsWin" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolalyticsAvg" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "blitzPick" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "blitzWin" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "blitzAvg" TYPE numeric(5,2)`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "blitzAvg" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "blitzWin" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "blitzPick" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolalyticsAvg" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolalyticsWin" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolalyticsPick" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolgraphsAvg" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolgraphsWin" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "lolgraphsPick" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "opggAvg" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "opggWin" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ALTER COLUMN "opggPick" TYPE numeric`);
    }
}
exports.Migration1618348550866 = Migration1618348550866;
