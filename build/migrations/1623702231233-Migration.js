"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1623702231233 = void 0;
class Migration1623702231233 {
    constructor() {
        this.name = 'Migration1623702231233';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "title" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "url" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "thumbnail" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "estimatedTime" SET DEFAULT '00:00h'`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "dueDate" SET DEFAULT ''`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "dueDate" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "estimatedTime" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "thumbnail" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "url" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "title" DROP DEFAULT`);
    }
}
exports.Migration1623702231233 = Migration1623702231233;
