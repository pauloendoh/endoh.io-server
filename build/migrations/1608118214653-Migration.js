"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1608118214653 = void 0;
class Migration1608118214653 {
    constructor() {
        this.name = 'Migration1608118214653';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_5d7f5222e6ff450caa2d8ba4d6a"`);
        await queryRunner.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_5d7f5222e6ff450caa2d8ba4d6a" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_5d7f5222e6ff450caa2d8ba4d6a"`);
        await queryRunner.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_5d7f5222e6ff450caa2d8ba4d6a" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.Migration1608118214653 = Migration1608118214653;
