import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1655851071581 implements MigrationInterface {
    name = 'Migration1655851071581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "learning" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "description" character varying NOT NULL DEFAULT '', "isHighlight" boolean NOT NULL DEFAULT false, "date" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_54998af12de15ed2831c8648ca2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "learning" ADD CONSTRAINT "FK_969b0a2a9ff915a5100a208f8ba" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "learning" DROP CONSTRAINT "FK_969b0a2a9ff915a5100a208f8ba"`);
        await queryRunner.query(`DROP TABLE "learning"`);
    }

}
