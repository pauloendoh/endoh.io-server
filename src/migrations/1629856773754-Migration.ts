import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1629856773754 implements MigrationInterface {
    name = 'Migration1629856773754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_champion" ADD "role" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "player_champion" ADD "skillLevel" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_champion" DROP COLUMN "skillLevel"`);
        await queryRunner.query(`ALTER TABLE "player_champion" DROP COLUMN "role"`);
    }

}
