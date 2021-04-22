"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1616328667778 = void 0;
class Migration1616328667778 {
    constructor() {
        this.name = 'Migration1616328667778';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_a7f555f9c2f9d82073510b0ffc0"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "REL_1ced25315eb974b73391fb1c81"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "UQ_a7f555f9c2f9d82073510b0ffc0"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "UQ_a7f555f9c2f9d82073510b0ffc0" UNIQUE ("followerId")`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "REL_1ced25315eb974b73391fb1c81" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_a7f555f9c2f9d82073510b0ffc0" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
exports.Migration1616328667778 = Migration1616328667778;
