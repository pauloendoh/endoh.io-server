"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1620226379421 = void 0;
class Migration1620226379421 {
    constructor() {
        this.name = 'Migration1620226379421';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "uggPick" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "uggWin" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "uggAvg" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "uggUpdatedAt" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "uggUpdatedAt"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "uggAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "uggWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "uggPick"`);
    }
}
exports.Migration1620226379421 = Migration1620226379421;
