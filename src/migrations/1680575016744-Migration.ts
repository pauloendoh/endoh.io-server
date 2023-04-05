import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1680575016744 implements MigrationInterface {
    name = 'Migration1680575016744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "animeSimiliarity"`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "mangaSimiliarity"`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "animePercentage" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "mangaPercentage" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "mangaPercentage"`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "animePercentage"`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "mangaSimiliarity" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "animeSimiliarity" double precision NOT NULL DEFAULT '0'`);
    }

}
