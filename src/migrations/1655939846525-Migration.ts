import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1655939846525 implements MigrationInterface {
    name = 'Migration1655939846525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."learning" RENAME COLUMN "date" TO "datetime"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."learning" RENAME COLUMN "datetime" TO "date"`);
    }

}
