"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1607700458379 = void 0;
class Migration1607700458379 {
    constructor() {
        this.name = 'Migration1607700458379';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "isCompleted"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" ADD "isCompleted" boolean NOT NULL DEFAULT false`);
    }
}
exports.Migration1607700458379 = Migration1607700458379;
