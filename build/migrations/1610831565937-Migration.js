"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1610831565937 = void 0;
class Migration1610831565937 {
    constructor() {
        this.name = 'Migration1610831565937';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user_preference" ("id" SERIAL NOT NULL, "relearnAutofillURL" boolean NOT NULL DEFAULT true, "relearnLastAccessedRoute" character varying NOT NULL DEFAULT '/', "skillbaseSidebarIsOpen" boolean NOT NULL DEFAULT false, "skillbaseSortSkill" text, "skillbaseTextFilter" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_5b141fbd1fef95a0540f7e7d1e" UNIQUE ("userId"), CONSTRAINT "PK_0532217bd629d0ccf06499c5841" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_preference" ADD CONSTRAINT "FK_5b141fbd1fef95a0540f7e7d1e2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_preference" DROP CONSTRAINT "FK_5b141fbd1fef95a0540f7e7d1e2"`);
        await queryRunner.query(`DROP TABLE "user_preference"`);
    }
}
exports.Migration1610831565937 = Migration1610831565937;
