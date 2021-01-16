import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1610819392198 implements MigrationInterface {
    name = 'Migration1610819392198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" ADD "position" integer`);
        await queryRunner.query(`ALTER TABLE "tag" ADD "color" character varying NOT NULL DEFAULT '#424242'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "position"`);
    }

}
