import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1689705740612 implements MigrationInterface {
    name = 'Migration1689705740612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "lastScraped"`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "lastScraped" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "friendsScrapedAt"`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "friendsScrapedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "friendsScrapedAt"`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "friendsScrapedAt" character varying`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "lastScraped"`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "lastScraped" character varying`);
    }

}
