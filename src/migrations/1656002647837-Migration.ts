import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1656002647837 implements MigrationInterface {
    name = 'Migration1656002647837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "response_time" ("id" SERIAL NOT NULL, "method" character varying NOT NULL, "endpoint" character varying NOT NULL, "millis" character varying NOT NULL, "responseSize" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3708d1e1494f231c0b5dd08ca81" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "response_time"`);
    }

}
