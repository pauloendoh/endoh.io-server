import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1612533974748 implements MigrationInterface {
    name = 'Migration1612533974748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill_progress" ADD "goalLevel" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill_progress" DROP COLUMN "goalLevel"`);
    }

}
