import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1625795206963 implements MigrationInterface {
    name = 'Migration1625795206963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decision_table_item" ALTER COLUMN "index" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "decision_table" ALTER COLUMN "index" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decision_table" ALTER COLUMN "index" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "decision_table_item" ALTER COLUMN "index" SET NOT NULL`);
    }

}
