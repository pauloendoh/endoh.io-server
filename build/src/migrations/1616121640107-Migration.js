"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1616121640107 = void 0;
class Migration1616121640107 {
    constructor() {
        this.name = 'Migration1616121640107';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "profile" ADD "picture" character varying NOT NULL DEFAULT ''`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "picture"`);
    }
}
exports.Migration1616121640107 = Migration1616121640107;
//# sourceMappingURL=1616121640107-Migration.js.map