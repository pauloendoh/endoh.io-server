"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1616299384726 = void 0;
class Migration1616299384726 {
    constructor() {
        this.name = 'Migration1616299384726';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notification" ADD "followerId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "UQ_a7f555f9c2f9d82073510b0ffc0" UNIQUE ("followerId")`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_a7f555f9c2f9d82073510b0ffc0" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_a7f555f9c2f9d82073510b0ffc0"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "UQ_a7f555f9c2f9d82073510b0ffc0"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "followerId"`);
    }
}
exports.Migration1616299384726 = Migration1616299384726;
