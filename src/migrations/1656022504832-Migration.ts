import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1656022504832 implements MigrationInterface {
    name = 'Migration1656022504832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."response_time" RENAME COLUMN "responseSize" TO "contentLengthKB"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."response_time" RENAME COLUMN "contentLengthKB" TO "responseSize"`);
    }

}
