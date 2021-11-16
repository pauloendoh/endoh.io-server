import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1637056650940 implements MigrationInterface {
    name = 'Migration1637056650940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."skill" ADD "currentGoal" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."skill" DROP COLUMN "currentGoal"`);
    }

}
