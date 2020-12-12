import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1607700458379 implements MigrationInterface {
    name = 'Migration1607700458379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "isCompleted"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" ADD "isCompleted" boolean NOT NULL DEFAULT false`);
    }

}
