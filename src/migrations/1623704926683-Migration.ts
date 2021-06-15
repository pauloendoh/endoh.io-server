import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1623704926683 implements MigrationInterface {
    name = 'Migration1623704926683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" ALTER COLUMN "question" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "note" ALTER COLUMN "weight" SET DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" ALTER COLUMN "weight" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "note" ALTER COLUMN "question" DROP DEFAULT`);
    }

}
