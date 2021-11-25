import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1637750874248 implements MigrationInterface {
    name = 'Migration1637750874248'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."skill" ADD "isPublic" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."skill" DROP COLUMN "isPublic"`);
    }

}
