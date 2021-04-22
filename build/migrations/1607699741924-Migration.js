"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1607699741924 = void 0;
class Migration1607699741924 {
    constructor() {
        this.name = 'Migration1607699741924';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" ADD "tagId" integer`);
        await queryRunner.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_5d7f5222e6ff450caa2d8ba4d6a" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_5d7f5222e6ff450caa2d8ba4d6a"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "tagId"`);
    }
}
exports.Migration1607699741924 = Migration1607699741924;
