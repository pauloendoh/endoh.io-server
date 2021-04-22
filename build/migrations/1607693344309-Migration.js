"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1607693344309 = void 0;
class Migration1607693344309 {
    constructor() {
        this.name = 'Migration1607693344309';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" ADD "completedAt" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "positionAtTag" integer`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "positionAtTag"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "completedAt"`);
    }
}
exports.Migration1607693344309 = Migration1607693344309;
