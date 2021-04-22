"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1610926333333 = void 0;
class Migration1610926333333 {
    constructor() {
        this.name = 'Migration1610926333333';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "skill_progress" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "skillId" integer NOT NULL, "oldLevel" integer, "newLevel" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_69253717fa7ce8e8fed5c237b5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "skill_progress" ADD CONSTRAINT "FK_bb0b9f98daada1b9141bd24fa06" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "skill_progress" ADD CONSTRAINT "FK_e266d46764298f1e0b2f4e4b629" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill_progress" DROP CONSTRAINT "FK_e266d46764298f1e0b2f4e4b629"`);
        await queryRunner.query(`ALTER TABLE "skill_progress" DROP CONSTRAINT "FK_bb0b9f98daada1b9141bd24fa06"`);
        await queryRunner.query(`DROP TABLE "skill_progress"`);
    }
}
exports.Migration1610926333333 = Migration1610926333333;
