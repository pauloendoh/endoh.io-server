import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1664111439995 implements MigrationInterface {
    name = 'Migration1664111439995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."doc" ADD "folderId" integer`);
        await queryRunner.query(`ALTER TABLE "public"."doc" ADD CONSTRAINT "FK_6c1e6ad89701f9e340d20e6cec2" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."doc" DROP CONSTRAINT "FK_6c1e6ad89701f9e340d20e6cec2"`);
        await queryRunner.query(`ALTER TABLE "public"."doc" DROP COLUMN "folderId"`);
    }

}
