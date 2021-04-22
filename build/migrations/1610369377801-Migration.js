"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1610369377801 = void 0;
class Migration1610369377801 {
    constructor() {
        this.name = 'Migration1610369377801';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "isPriority" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "currentLevel" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "goalLevel" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "goalLevel" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "currentLevel" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "isPriority" DROP DEFAULT`);
    }
}
exports.Migration1610369377801 = Migration1610369377801;
