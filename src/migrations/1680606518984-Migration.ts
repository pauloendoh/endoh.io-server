import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1680606518984 implements MigrationInterface {
    name = 'Migration1680606518984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "friendsScrapedAt" character varying`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "imageUrl" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "checked" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "checked"`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "friendsScrapedAt"`);
    }

}
