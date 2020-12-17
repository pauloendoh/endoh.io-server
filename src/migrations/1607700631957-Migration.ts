import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1607700631957 implements MigrationInterface {
    name = 'Migration1607700631957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "rating" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "rating" SET NOT NULL`);
    }

}
