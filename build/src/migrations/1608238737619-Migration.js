"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1608238737619 = void 0;
class Migration1608238737619 {
    constructor() {
        this.name = 'Migration1608238737619';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "rating" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "rating" DROP DEFAULT`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "rating" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "rating" SET NOT NULL`);
    }
}
exports.Migration1608238737619 = Migration1608238737619;
//# sourceMappingURL=1608238737619-Migration.js.map