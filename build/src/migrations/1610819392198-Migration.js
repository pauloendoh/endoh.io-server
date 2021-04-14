"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1610819392198 = void 0;
class Migration1610819392198 {
    constructor() {
        this.name = 'Migration1610819392198';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tag" ADD "position" integer`);
        await queryRunner.query(`ALTER TABLE "tag" ADD "color" character varying NOT NULL DEFAULT '#424242'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "position"`);
    }
}
exports.Migration1610819392198 = Migration1610819392198;
//# sourceMappingURL=1610819392198-Migration.js.map