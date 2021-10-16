import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1634379778133 implements MigrationInterface {
    name = 'Migration1634379778133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."doc" ADD "lastOpenedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."doc" DROP COLUMN "lastOpenedAt"`);
    }

}
