import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1680573855043 implements MigrationInterface {
    name = 'Migration1680573855043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "gender" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "location" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "birthday" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "birthday"`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "gender"`);
    }

}
