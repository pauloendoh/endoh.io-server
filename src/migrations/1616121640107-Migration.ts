import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1616121640107 implements MigrationInterface {
    name = 'Migration1616121640107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "picture" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "picture"`);
    }

}
