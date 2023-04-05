import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1680566594409 implements MigrationInterface {
    name = 'Migration1680566594409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mal_user" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_920183f58fac3cac92126f58337" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "mal_user"`);
    }

}
