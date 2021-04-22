"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1616420473354 = void 0;
class Migration1616420473354 {
    constructor() {
        this.name = 'Migration1616420473354';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "picture"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ADD "picture" character varying NOT NULL DEFAULT ''`);
    }
}
exports.Migration1616420473354 = Migration1616420473354;
