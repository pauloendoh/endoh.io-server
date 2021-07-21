import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1626901102693 implements MigrationInterface {
    name = 'Migration1626901102693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decision_table_item" ALTER COLUMN "weight" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "decision_table_item" ALTER COLUMN "weight" SET DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "decision_table_item" ALTER COLUMN "weight" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "decision_table_item" ALTER COLUMN "weight" DROP NOT NULL`);
    }

}
