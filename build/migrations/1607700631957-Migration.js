"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1607700631957 = void 0;
class Migration1607700631957 {
    constructor() {
        this.name = 'Migration1607700631957';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "rating" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "rating" SET NOT NULL`);
    }
}
exports.Migration1607700631957 = Migration1607700631957;
//# sourceMappingURL=1607700631957-Migration.js.map