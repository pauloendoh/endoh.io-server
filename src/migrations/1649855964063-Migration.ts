import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1649855964063 implements MigrationInterface {
    name = 'Migration1649855964063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."skill_expectation" ADD "isCurrentGoal" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."skill_expectation" DROP COLUMN "isCurrentGoal"`);
    }

}
