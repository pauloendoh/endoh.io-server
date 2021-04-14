"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1610538859429 = void 0;
class Migration1610538859429 {
    constructor() {
        this.name = 'Migration1610538859429';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "skill_tag" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "isPriority" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL DEFAULT '', "color" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_baf77b4425a5a17eedf05a97d23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "skill_tag" ADD CONSTRAINT "FK_d242569f4f2845158d5dddceeb0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "skill_tag" DROP CONSTRAINT "FK_d242569f4f2845158d5dddceeb0"`);
        await queryRunner.query(`DROP TABLE "skill_tag"`);
    }
}
exports.Migration1610538859429 = Migration1610538859429;
//# sourceMappingURL=1610538859429-Migration.js.map