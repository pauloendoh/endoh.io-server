import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1649340808602 implements MigrationInterface {
    name = 'Migration1649340808602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "label" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "name" character varying NOT NULL DEFAULT '', "bgColor" character varying NOT NULL DEFAULT '#db4035', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5692ac5348861d3776eb5843672" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skill_labels_label" ("skillId" integer NOT NULL, "labelId" integer NOT NULL, CONSTRAINT "PK_f4b488c8c60cbedfcce337e967f" PRIMARY KEY ("skillId", "labelId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c44aa7bb3b01f6065a5875dd0c" ON "skill_labels_label" ("skillId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6283cffeed2fc51d8c28399407" ON "skill_labels_label" ("labelId") `);
        await queryRunner.query(`ALTER TABLE "public"."user_token" DROP CONSTRAINT "FK_d37db50eecdf9b8ce4eedd2f918"`);
        await queryRunner.query(`COMMENT ON COLUMN "public"."user_token"."userId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "label" ADD CONSTRAINT "FK_e5d0325ea0283e5f316dee36a08" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."user_token" ADD CONSTRAINT "FK_d37db50eecdf9b8ce4eedd2f918" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "skill_labels_label" ADD CONSTRAINT "FK_c44aa7bb3b01f6065a5875dd0c7" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "skill_labels_label" ADD CONSTRAINT "FK_6283cffeed2fc51d8c28399407f" FOREIGN KEY ("labelId") REFERENCES "label"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill_labels_label" DROP CONSTRAINT "FK_6283cffeed2fc51d8c28399407f"`);
        await queryRunner.query(`ALTER TABLE "skill_labels_label" DROP CONSTRAINT "FK_c44aa7bb3b01f6065a5875dd0c7"`);
        await queryRunner.query(`ALTER TABLE "public"."user_token" DROP CONSTRAINT "FK_d37db50eecdf9b8ce4eedd2f918"`);
        await queryRunner.query(`ALTER TABLE "label" DROP CONSTRAINT "FK_e5d0325ea0283e5f316dee36a08"`);
        await queryRunner.query(`COMMENT ON COLUMN "public"."user_token"."userId" IS 'LMAO'`);
        await queryRunner.query(`ALTER TABLE "public"."user_token" ADD CONSTRAINT "FK_d37db50eecdf9b8ce4eedd2f918" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX "IDX_6283cffeed2fc51d8c28399407"`);
        await queryRunner.query(`DROP INDEX "IDX_c44aa7bb3b01f6065a5875dd0c"`);
        await queryRunner.query(`DROP TABLE "skill_labels_label"`);
        await queryRunner.query(`DROP TABLE "label"`);
    }

}
