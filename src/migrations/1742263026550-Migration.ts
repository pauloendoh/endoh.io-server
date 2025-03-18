import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742263026550 implements MigrationInterface {
    name = 'Migration1742263026550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "priority"`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "priority" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "priority"`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "priority" integer`);
    }

}
