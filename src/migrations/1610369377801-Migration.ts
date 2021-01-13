import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1610369377801 implements MigrationInterface {
    name = 'Migration1610369377801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "isPriority" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "currentLevel" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "goalLevel" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "goalLevel" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "currentLevel" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "skill" ALTER COLUMN "isPriority" DROP DEFAULT`);
    }

}
