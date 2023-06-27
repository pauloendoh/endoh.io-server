import { MigrationInterface, QueryRunner } from "typeorm"

export class Migration1687883992215 implements MigrationInterface {
  name = "Migration1687883992215"

  public async up(queryRunner: QueryRunner): Promise<void> {
    // change type integer to numeric, without droping column
    await queryRunner.query(
      `ALTER TABLE "learning" ALTER COLUMN "points" TYPE numeric(5,2) USING "points"::numeric(5,2)`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "learning" DROP COLUMN "points"`)
    await queryRunner.query(
      `ALTER TABLE "learning" ADD "points" integer NOT NULL DEFAULT '1'`
    )
  }
}
