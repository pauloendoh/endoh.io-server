import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1607693344309 implements MigrationInterface {
    name = 'Migration1607693344309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" ADD "completedAt" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "positionAtTag" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "positionAtTag"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "completedAt"`);
    }

}
