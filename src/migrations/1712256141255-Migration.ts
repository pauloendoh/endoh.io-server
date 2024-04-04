import { MigrationInterface, QueryRunner } from "typeorm"

export class Migration1712256141255 implements MigrationInterface {
  name = "Migration1712256141255"

  public async up(queryRunner: QueryRunner): Promise<void> {
    // rename table notes to questions
    await queryRunner.query(`ALTER TABLE "note" RENAME TO "question"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "question" RENAME TO "note"`)
  }
}
