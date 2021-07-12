import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1625771001667 implements MigrationInterface {
    name = 'Migration1625771001667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "decision_table_item" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "decisionTableId" integer NOT NULL, "index" integer NOT NULL, "problem" character varying NOT NULL, "solution" character varying NOT NULL, "weight" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_821c3ecc01d866ade5b6c09a5e0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "decision_table" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "decisionId" integer NOT NULL, "title" character varying NOT NULL, "index" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9f920d3366b9d4478e834b02499" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "decision" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "title" character varying NOT NULL, "isPriority" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fa4cbd6abf1215054f13c27df5a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "decision_table_item" ADD CONSTRAINT "FK_27ac768b967de8aac4989320dd7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "decision_table_item" ADD CONSTRAINT "FK_504f4728581ddd0a9dc90282930" FOREIGN KEY ("decisionTableId") REFERENCES "decision_table"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "decision_table" ADD CONSTRAINT "FK_1758903347f799c4c3884c313ce" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "decision_table" ADD CONSTRAINT "FK_1a32cf84089aa689fa91be69228" FOREIGN KEY ("decisionId") REFERENCES "decision"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "decision" ADD CONSTRAINT "FK_0599b805493f0caee01b358867d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decision" DROP CONSTRAINT "FK_0599b805493f0caee01b358867d"`);
        await queryRunner.query(`ALTER TABLE "decision_table" DROP CONSTRAINT "FK_1a32cf84089aa689fa91be69228"`);
        await queryRunner.query(`ALTER TABLE "decision_table" DROP CONSTRAINT "FK_1758903347f799c4c3884c313ce"`);
        await queryRunner.query(`ALTER TABLE "decision_table_item" DROP CONSTRAINT "FK_504f4728581ddd0a9dc90282930"`);
        await queryRunner.query(`ALTER TABLE "decision_table_item" DROP CONSTRAINT "FK_27ac768b967de8aac4989320dd7"`);
        await queryRunner.query(`DROP TABLE "decision"`);
        await queryRunner.query(`DROP TABLE "decision_table"`);
        await queryRunner.query(`DROP TABLE "decision_table_item"`);
    }

}
