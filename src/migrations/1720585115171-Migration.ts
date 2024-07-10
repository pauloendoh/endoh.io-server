import { MigrationInterface, QueryRunner } from "typeorm"

export class Migration1720585115171 implements MigrationInterface {
  name = "Migration1720585115171"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "skill" ADD "priority" double precision`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "priority"`)
  }
}
