"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1610368988712 = void 0;
class Migration1610368988712 {
    constructor() {
        this.name = 'Migration1610368988712';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "skill" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "isPriority" boolean NOT NULL, "name" character varying NOT NULL, "currentLevel" integer NOT NULL, "goalLevel" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a0d33334424e64fb78dc3ce7196" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_c08612011a88745a32784544b28" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_c08612011a88745a32784544b28"`);
        await queryRunner.query(`DROP TABLE "skill"`);
    }
}
exports.Migration1610368988712 = Migration1610368988712;
