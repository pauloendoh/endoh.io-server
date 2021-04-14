"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1616606026611 = void 0;
class Migration1616606026611 {
    constructor() {
        this.name = 'Migration1616606026611';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "test" ADD "name" character varying NOT NULL DEFAULT ''`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "name"`);
    }
}
exports.Migration1616606026611 = Migration1616606026611;
//# sourceMappingURL=1616606026611-Migration.js.map