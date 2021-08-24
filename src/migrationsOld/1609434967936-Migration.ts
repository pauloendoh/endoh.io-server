import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1609434967936 implements MigrationInterface {
    name = 'Migration1609434967936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "googleId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_470355432cc67b2c470c30bef7c" UNIQUE ("googleId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_470355432cc67b2c470c30bef7c"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleId"`);
    }

}
