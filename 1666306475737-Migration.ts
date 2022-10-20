import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1666306475737 implements MigrationInterface {
    name = 'Migration1666306475737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" ADD "isTrue" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "isTrue"`);
    }

}
