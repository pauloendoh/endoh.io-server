"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1612533974748 = void 0;
class Migration1612533974748 {
    constructor() {
        this.name = 'Migration1612533974748';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill_progress" ADD "goalLevel" integer`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill_progress" DROP COLUMN "goalLevel"`);
    }
}
exports.Migration1612533974748 = Migration1612533974748;
