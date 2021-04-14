"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1610376135091 = void 0;
class Migration1610376135091 {
    constructor() {
        this.name = 'Migration1610376135091';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "name" SET DEFAULT ''`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "name" DROP DEFAULT`);
    }
}
exports.Migration1610376135091 = Migration1610376135091;
//# sourceMappingURL=1610376135091-Migration.js.map