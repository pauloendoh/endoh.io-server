import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1623407448223 implements MigrationInterface {
    name = 'Migration1623407448223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "note" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "docId" integer NOT NULL, "index" integer NOT NULL, "description" character varying NOT NULL, "question" character varying NOT NULL, "weight" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "doc" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_10d9859fc620db615c8aa74e324" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_960e423bd8c1f0d9913bc1c099e" FOREIGN KEY ("docId") REFERENCES "doc"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doc" ADD CONSTRAINT "FK_b03ab8f5200e43d56ec0310a363" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doc" DROP CONSTRAINT "FK_b03ab8f5200e43d56ec0310a363"`);
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_960e423bd8c1f0d9913bc1c099e"`);
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b"`);
        await queryRunner.query(`DROP TABLE "doc"`);
        await queryRunner.query(`DROP TABLE "note"`);
    }

}
