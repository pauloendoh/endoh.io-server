import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1679883297225 implements MigrationInterface {
    name = 'Migration1679883297225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "aramWin" double precision`);
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "aramUpdatedAt" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "aramUpdatedAt"`);
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "aramWin"`);
    }

}
