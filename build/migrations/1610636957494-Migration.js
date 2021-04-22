"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1610636957494 = void 0;
class Migration1610636957494 {
    constructor() {
        this.name = 'Migration1610636957494';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "expiresAt" TIMESTAMP WITH TIME ZONE`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "expiresAt" character varying NOT NULL DEFAULT ''`);
    }
}
exports.Migration1610636957494 = Migration1610636957494;
//# sourceMappingURL=1610636957494-Migration.js.map