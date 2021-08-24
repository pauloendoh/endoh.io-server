import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1608238737619 implements MigrationInterface {
    name = 'Migration1608238737619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "rating" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "rating" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "rating" SET DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "rating" SET NOT NULL`);
    }

}
