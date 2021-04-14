"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1612892521413 = void 0;
class Migration1612892521413 {
    constructor() {
        this.name = 'Migration1612892521413';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tag" ADD "isPrivate" boolean NOT NULL DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "isPrivate"`);
    }
}
exports.Migration1612892521413 = Migration1612892521413;
//# sourceMappingURL=1612892521413-Migration.js.map