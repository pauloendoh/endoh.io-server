"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1623704926683 = void 0;
class Migration1623704926683 {
    constructor() {
        this.name = 'Migration1623704926683';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "note" ALTER COLUMN "question" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "note" ALTER COLUMN "weight" SET DEFAULT 1`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "note" ALTER COLUMN "weight" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "note" ALTER COLUMN "question" DROP DEFAULT`);
    }
}
exports.Migration1623704926683 = Migration1623704926683;
