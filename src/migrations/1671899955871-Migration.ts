import { MigrationInterface, QueryRunner } from "typeorm"

export class Migration1671899955871 implements MigrationInterface {
  name = "Migration1671899955871"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "note" DROP COLUMN IF EXISTS "questionText"`
    )
    await queryRunner.query(`ALTER TABLE "note" DROP COLUMN IF EXISTS "answer"`)
    await queryRunner.query(
      `ALTER TABLE "test" DROP COLUMN IF EXISTS  "secret"`
    )
    await queryRunner.query(
      `ALTER TABLE "note" ADD "testedTimes" integer NOT NULL DEFAULT '0'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "note" DROP COLUMN IF EXISTS "testedTimes"`
    )
    await queryRunner.query(`ALTER TABLE "test" ADD "secret" character varying`)
    await queryRunner.query(`ALTER TABLE "note" ADD "answer" character varying`)
    await queryRunner.query(
      `ALTER TABLE "note" ADD "questionText" character varying`
    )
  }
}
