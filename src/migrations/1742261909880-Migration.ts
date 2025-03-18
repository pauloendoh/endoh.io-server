import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742261909880 implements MigrationInterface {
    name = 'Migration1742261909880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" ADD "priority" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "priority"`);
    }

}
