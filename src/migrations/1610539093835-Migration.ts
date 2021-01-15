import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1610539093835 implements MigrationInterface {
    name = 'Migration1610539093835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill_tag" DROP COLUMN "isPriority"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill_tag" ADD "isPriority" boolean NOT NULL DEFAULT false`);
    }

}
