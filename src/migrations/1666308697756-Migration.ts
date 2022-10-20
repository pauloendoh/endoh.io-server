import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1666308697756 implements MigrationInterface {
    name = 'Migration1666308697756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" ADD "isTrue" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test" DROP COLUMN "isTrue"`);
    }

}
