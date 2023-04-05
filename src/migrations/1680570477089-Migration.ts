import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1680570477089 implements MigrationInterface {
    name = 'Migration1680570477089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ALTER COLUMN "animeSimiliarity" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ALTER COLUMN "animeCount" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ALTER COLUMN "mangaSimiliarity" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ALTER COLUMN "mangaCount" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ALTER COLUMN "mangaCount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ALTER COLUMN "mangaSimiliarity" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ALTER COLUMN "animeCount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ALTER COLUMN "animeSimiliarity" DROP DEFAULT`);
    }

}
