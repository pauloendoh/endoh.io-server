import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1610982266005 implements MigrationInterface {
    name = 'Migration1610982266005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" ALTER COLUMN "color" SET DEFAULT '#ffffff'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" ALTER COLUMN "color" SET DEFAULT '#424242'`);
    }

}
