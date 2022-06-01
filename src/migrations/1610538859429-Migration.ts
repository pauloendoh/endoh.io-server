import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1610538859429 implements MigrationInterface {
    name = 'Migration1610538859429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "skill_tag" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "isPriority" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL DEFAULT '', "color" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_baf77b4425a5a17eedf05a97d23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "skill_tag" ADD CONSTRAINT "FK_d242569f4f2845158d5dddceeb0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill_tag" DROP CONSTRAINT "FK_d242569f4f2845158d5dddceeb0"`);
        await queryRunner.query(`DROP TABLE "skill_tag"`);
    }

}
