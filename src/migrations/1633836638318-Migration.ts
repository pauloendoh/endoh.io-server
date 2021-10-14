import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1633836638318 implements MigrationInterface {
    name = 'Migration1633836638318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."tag" ADD "lastOpenedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."tag" DROP COLUMN "lastOpenedAt"`);
    }

}
