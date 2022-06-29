import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1656024357541 implements MigrationInterface {
    name = 'Migration1656024357541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "contentLengthKB"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "path"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "params"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "query"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "endpoint" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "contentLengthBytes" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "contentLengthBytes"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "endpoint"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "query" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "params" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "path" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "contentLengthKB" numeric NOT NULL DEFAULT '0'`);
    }

}
