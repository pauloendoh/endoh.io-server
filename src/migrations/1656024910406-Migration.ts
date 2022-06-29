import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1656024910406 implements MigrationInterface {
    name = 'Migration1656024910406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "millis"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "millis" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "millis"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "millis" numeric NOT NULL`);
    }

}
