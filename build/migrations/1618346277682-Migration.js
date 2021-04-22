"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1618346277682 = void 0;
class Migration1618346277682 {
    constructor() {
        this.name = 'Migration1618346277682';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "role" character varying NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "role"`);
    }
}
exports.Migration1618346277682 = Migration1618346277682;
