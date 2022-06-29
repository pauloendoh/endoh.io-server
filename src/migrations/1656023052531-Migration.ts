import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1656023052531 implements MigrationInterface {
    name = 'Migration1656023052531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "contentLengthKB"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "contentLengthKB" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."response_time" DROP COLUMN "contentLengthKB"`);
        await queryRunner.query(`ALTER TABLE "public"."response_time" ADD "contentLengthKB" integer NOT NULL DEFAULT '0'`);
    }

}
