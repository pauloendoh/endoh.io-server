import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1680569925817 implements MigrationInterface {
    name = 'Migration1680569925817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ALTER COLUMN "lastScraped" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ALTER COLUMN "lastScraped" SET NOT NULL`);
    }

}
