import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1610376135091 implements MigrationInterface {
    name = 'Migration1610376135091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "name" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "name" DROP DEFAULT`);
    }

}
