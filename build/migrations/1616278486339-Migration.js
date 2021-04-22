"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1616278486339 = void 0;
class Migration1616278486339 {
    constructor() {
        this.name = 'Migration1616278486339';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "picture"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "pictureUrl" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "pictureName" character varying NOT NULL DEFAULT ''`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "pictureName"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "pictureUrl"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "picture" character varying NOT NULL DEFAULT ''`);
    }
}
exports.Migration1616278486339 = Migration1616278486339;
