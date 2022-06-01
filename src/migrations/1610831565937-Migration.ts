import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1610831565937 implements MigrationInterface {
    name = 'Migration1610831565937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_preference" ("id" SERIAL NOT NULL, "relearnAutofillURL" boolean NOT NULL DEFAULT true, "relearnLastAccessedRoute" character varying NOT NULL DEFAULT '/', "skillbaseSidebarIsOpen" boolean NOT NULL DEFAULT false, "skillbaseSortSkill" text, "skillbaseTextFilter" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_5b141fbd1fef95a0540f7e7d1e" UNIQUE ("userId"), CONSTRAINT "PK_0532217bd629d0ccf06499c5841" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_preference" ADD CONSTRAINT "FK_5b141fbd1fef95a0540f7e7d1e2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_preference" DROP CONSTRAINT "FK_5b141fbd1fef95a0540f7e7d1e2"`);
        await queryRunner.query(`DROP TABLE "user_preference"`);
    }

}
