import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1651007225613 implements MigrationInterface {
    name = 'Migration1651007225613'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."skill_history" ADD "currentLevel" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."skill_history" DROP COLUMN "currentLevel"`);
    }

}
