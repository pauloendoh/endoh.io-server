"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1610982266005 = void 0;
class Migration1610982266005 {
    constructor() {
        this.name = 'Migration1610982266005';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tag" ALTER COLUMN "color" SET DEFAULT '#ffffff'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tag" ALTER COLUMN "color" SET DEFAULT '#424242'`);
    }
}
exports.Migration1610982266005 = Migration1610982266005;
//# sourceMappingURL=1610982266005-Migration.js.map