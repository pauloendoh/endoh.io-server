"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1616608822409 = void 0;
class Migration1616608822409 {
    constructor() {
        this.name = 'Migration1616608822409';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "test" ADD "color" character varying NOT NULL DEFAULT ''`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "color"`);
    }
}
exports.Migration1616608822409 = Migration1616608822409;
