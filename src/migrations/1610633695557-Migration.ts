import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1610633695557 implements MigrationInterface {
    name = 'Migration1610633695557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "expiresAt" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "expiresAt"`);
    }

}
