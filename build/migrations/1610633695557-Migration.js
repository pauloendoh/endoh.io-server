"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1610633695557 = void 0;
class Migration1610633695557 {
    constructor() {
        this.name = 'Migration1610633695557';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ADD "expiresAt" character varying NOT NULL DEFAULT ''`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expiresAt"`);
    }
}
exports.Migration1610633695557 = Migration1610633695557;
//# sourceMappingURL=1610633695557-Migration.js.map