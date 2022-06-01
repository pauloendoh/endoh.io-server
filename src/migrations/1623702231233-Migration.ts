import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1623702231233 implements MigrationInterface {
    name = 'Migration1623702231233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "title" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "url" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "thumbnail" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "estimatedTime" SET DEFAULT '00:00h'`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "dueDate" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "dueDate" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "estimatedTime" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "thumbnail" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "url" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "title" DROP DEFAULT`);
    }

}
