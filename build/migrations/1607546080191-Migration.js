"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1607546080191 = void 0;
class Migration1607546080191 {
    constructor() {
        this.name = 'Migration1607546080191';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" ADD "rating" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "isCompleted" boolean NOT NULL DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "isCompleted"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "rating"`);
    }
}
exports.Migration1607546080191 = Migration1607546080191;
