import { MigrationInterface, QueryRunner } from "typeorm"

export class Migration1675720211168 implements MigrationInterface {
  name = "Migration1675720211168"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "learning" ADD "points" integer NOT NULL DEFAULT '1'`
    )

    // where learning.highlight is true, update points to 2
    await queryRunner.query(
      `UPDATE "learning" SET "points" = 2 WHERE "isHighlight" = true`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "learning" DROP COLUMN "points"`)
  }
}
