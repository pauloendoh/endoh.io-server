"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1607452207029 = void 0;
class Migration1607452207029 {
    constructor() {
        this.name = 'Migration1607452207029';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tag" RENAME COLUMN "nameBazzinga" TO "name"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tag" RENAME COLUMN "name" TO "nameBazzinga"`);
    }
}
exports.Migration1607452207029 = Migration1607452207029;
