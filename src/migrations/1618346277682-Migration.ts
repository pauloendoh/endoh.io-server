import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1618346277682 implements MigrationInterface {
    name = 'Migration1618346277682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lol_rate" ADD "role" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lol_rate" DROP COLUMN "role"`);
    }

}
