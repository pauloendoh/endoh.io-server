import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1616420473354 implements MigrationInterface {
    name = 'Migration1616420473354'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "picture"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "picture" character varying NOT NULL DEFAULT ''`);
    }

}
