import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751219412330 implements MigrationInterface {
    name = 'Migration1751219412330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_champion" ADD "notes" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_champion" DROP COLUMN "notes"`);
    }

}
