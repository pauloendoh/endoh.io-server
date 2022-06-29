import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1656003504865 implements MigrationInterface {
    name = 'Migration1656003504865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "millis"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "millis" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "millis"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "millis" character varying NOT NULL`);
    }

}
