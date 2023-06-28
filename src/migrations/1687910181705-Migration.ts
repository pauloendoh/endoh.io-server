import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1687910181705 implements MigrationInterface {
    name = 'Migration1687910181705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recurrent_learning" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "description" character varying NOT NULL DEFAULT '', "points" numeric(5,2) NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4a49daf924884378b17de19f139" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recurrent_learning" ADD CONSTRAINT "FK_d6837043e010ac9c8813a97867a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recurrent_learning" DROP CONSTRAINT "FK_d6837043e010ac9c8813a97867a"`);
        await queryRunner.query(`DROP TABLE "recurrent_learning"`);
    }

}
