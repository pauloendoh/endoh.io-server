import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1656012164453 implements MigrationInterface {
    name = 'Migration1656012164453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "millis"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "millis" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "millis"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "millis" integer NOT NULL`);
    }

}
