"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1607911728358 = void 0;
class Migration1607911728358 {
    constructor() {
        this.name = 'Migration1607911728358';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" RENAME COLUMN "positionAtTag" TO "position"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" RENAME COLUMN "position" TO "positionAtTag"`);
    }
}
exports.Migration1607911728358 = Migration1607911728358;
//# sourceMappingURL=1607911728358-Migration.js.map