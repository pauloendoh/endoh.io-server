import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1629802225477 implements MigrationInterface {
    name = 'Migration1629802225477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "champion" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "iconUrl" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1b5629380079d160350cfc907b7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "champion"`);
    }

}
