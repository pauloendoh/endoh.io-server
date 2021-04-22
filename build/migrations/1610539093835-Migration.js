"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1610539093835 = void 0;
class Migration1610539093835 {
    constructor() {
        this.name = 'Migration1610539093835';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill_tag" DROP COLUMN "isPriority"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill_tag" ADD "isPriority" boolean NOT NULL DEFAULT false`);
    }
}
exports.Migration1610539093835 = Migration1610539093835;
