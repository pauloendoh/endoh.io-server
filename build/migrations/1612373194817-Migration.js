"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1612373194817 = void 0;
class Migration1612373194817 {
    constructor() {
        this.name = 'Migration1612373194817';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_013750d508fe03dc1fc89106d4c"`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "publicReview" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "privateNote" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_013750d508fe03dc1fc89106d4c" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_013750d508fe03dc1fc89106d4c"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "privateNote"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "publicReview"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_013750d508fe03dc1fc89106d4c" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
exports.Migration1612373194817 = Migration1612373194817;
