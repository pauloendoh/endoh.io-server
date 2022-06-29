import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1656023808331 implements MigrationInterface {
    name = 'Migration1656023808331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "endpoint"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "path" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "params" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "query" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "statusCode" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "statusCode"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "query"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "params"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "path"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "endpoint" character varying NOT NULL`);
    }

}
