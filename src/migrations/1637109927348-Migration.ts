import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1637109927348 implements MigrationInterface {
    name = 'Migration1637109927348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."skill" DROP COLUMN "currentGoal"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."skill" ADD "currentGoal" integer`);
    }

}
