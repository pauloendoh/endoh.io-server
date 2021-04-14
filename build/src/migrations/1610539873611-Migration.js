"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1610539873611 = void 0;
class Migration1610539873611 {
    constructor() {
        this.name = 'Migration1610539873611';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill" ADD "skillTagId" integer`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_c0d4158b81ff40e83503ffed8ab" FOREIGN KEY ("skillTagId") REFERENCES "skill_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_c0d4158b81ff40e83503ffed8ab"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "skillTagId"`);
    }
}
exports.Migration1610539873611 = Migration1610539873611;
//# sourceMappingURL=1610539873611-Migration.js.map