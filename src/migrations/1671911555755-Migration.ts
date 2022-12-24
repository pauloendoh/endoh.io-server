import { MigrationInterface, QueryRunner } from "typeorm"

export class Migration1671911555755 implements MigrationInterface {
  name = "Migration1671911555755"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "note" ALTER COLUMN "weight" TYPE NUMERIC(5,2)`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "note" ALTER COLUMN "weight" TYPE integer`
    )
  }
}
