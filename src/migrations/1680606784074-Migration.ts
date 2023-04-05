import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1680606784074 implements MigrationInterface {
    name = 'Migration1680606784074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" ADD "lastOnlineAt" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mal_user_similarity" DROP COLUMN "lastOnlineAt"`);
    }

}
