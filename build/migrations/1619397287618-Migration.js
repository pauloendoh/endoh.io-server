"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1619397287618 = void 0;
class Migration1619397287618 {
    constructor() {
        this.name = 'Migration1619397287618';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "skill_expectation" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "skillId" integer, "level" integer NOT NULL, "index" integer NOT NULL, "description" character varying NOT NULL, "checked" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_87b4968c630fc6a8fcc1ce55293" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "skill_expectation" ADD CONSTRAINT "FK_0dc3ff818bdf9d5a2273f51b985" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "skill_expectation" ADD CONSTRAINT "FK_aa3d18311cf9042ea1068cc35e1" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill_expectation" DROP CONSTRAINT "FK_aa3d18311cf9042ea1068cc35e1"`);
        await queryRunner.query(`ALTER TABLE "skill_expectation" DROP CONSTRAINT "FK_0dc3ff818bdf9d5a2273f51b985"`);
        await queryRunner.query(`DROP TABLE "skill_expectation"`);
    }
}
exports.Migration1619397287618 = Migration1619397287618;
