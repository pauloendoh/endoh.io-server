"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1609434967936 = void 0;
class Migration1609434967936 {
    constructor() {
        this.name = 'Migration1609434967936';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ADD "googleId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_470355432cc67b2c470c30bef7c" UNIQUE ("googleId")`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_470355432cc67b2c470c30bef7c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleId"`);
    }
}
exports.Migration1609434967936 = Migration1609434967936;
