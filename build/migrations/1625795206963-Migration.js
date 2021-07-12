"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1625795206963 = void 0;
class Migration1625795206963 {
    constructor() {
        this.name = 'Migration1625795206963';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "decision_table_item" ALTER COLUMN "index" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "decision_table" ALTER COLUMN "index" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "decision_table" ALTER COLUMN "index" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "decision_table_item" ALTER COLUMN "index" SET NOT NULL`);
    }
}
exports.Migration1625795206963 = Migration1625795206963;
