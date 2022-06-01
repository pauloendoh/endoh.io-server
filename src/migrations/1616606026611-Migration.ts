import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1616606026611 implements MigrationInterface {
    name = 'Migration1616606026611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" ADD "name" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "name"`);
    }

}
