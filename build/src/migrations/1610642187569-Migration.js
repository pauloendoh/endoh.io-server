"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1610642187569 = void 0;
class Migration1610642187569 {
    constructor() {
        this.name = 'Migration1610642187569';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_c0d4158b81ff40e83503ffed8ab"`);
        await queryRunner.query(`ALTER TABLE "skill" RENAME COLUMN "skillTagId" TO "tagId"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_013750d508fe03dc1fc89106d4c" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_013750d508fe03dc1fc89106d4c"`);
        await queryRunner.query(`ALTER TABLE "skill" RENAME COLUMN "tagId" TO "skillTagId"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_c0d4158b81ff40e83503ffed8ab" FOREIGN KEY ("skillTagId") REFERENCES "skill_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
exports.Migration1610642187569 = Migration1610642187569;
//# sourceMappingURL=1610642187569-Migration.js.map