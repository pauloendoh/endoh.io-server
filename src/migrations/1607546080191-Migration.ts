import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1607546080191 implements MigrationInterface {
    name = 'Migration1607546080191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" ADD "rating" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "isCompleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "isCompleted"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "rating"`);
    }

}
