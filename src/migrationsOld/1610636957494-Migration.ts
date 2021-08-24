import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1610636957494 implements MigrationInterface {
    name = 'Migration1610636957494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "expiresAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "expiresAt" character varying NOT NULL DEFAULT ''`);
    }

}
