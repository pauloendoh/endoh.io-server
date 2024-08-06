import { MigrationInterface, QueryRunner } from "typeorm"

export class Migration1722899892198 implements MigrationInterface {
  name = "Migration1722899892198"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "skill" ADD "discomfortZone" double precision`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "discomfortZone"`)
  }
}
