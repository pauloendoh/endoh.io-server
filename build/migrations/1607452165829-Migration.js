"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1607452165829 = void 0;
class Migration1607452165829 {
    constructor() {
        this.name = 'Migration1607452165829';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tag" RENAME COLUMN "name" TO "nameBazzinga"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tag" RENAME COLUMN "nameBazzinga" TO "name"`);
    }
}
exports.Migration1607452165829 = Migration1607452165829;
//# sourceMappingURL=1607452165829-Migration.js.map