import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1616608822409 implements MigrationInterface {
    name = 'Migration1616608822409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" ADD "color" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "color"`);
    }

}
