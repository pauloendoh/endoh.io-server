import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1620226379421 implements MigrationInterface {
    name = 'Migration1620226379421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "uggPick" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "uggWin" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "uggAvg" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "uggUpdatedAt" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "uggUpdatedAt"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "uggAvg"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "uggWin"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "uggPick"`);
    }

}
