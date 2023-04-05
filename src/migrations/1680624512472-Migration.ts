import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1680624512472 implements MigrationInterface {
    name = 'Migration1680624512472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "lastErrorAt" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "lastErrorAt"`);
    }

}
