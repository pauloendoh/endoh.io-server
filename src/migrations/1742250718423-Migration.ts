import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1742250718423 implements MigrationInterface {
    name = 'Migration1742250718423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tag_sortingby_enum" AS ENUM('default', 'priority')`);
        await queryRunner.query(`ALTER TABLE "tag" ADD "sortingBy" "public"."tag_sortingby_enum" NOT NULL DEFAULT 'default'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "sortingBy"`);
        await queryRunner.query(`DROP TYPE "public"."tag_sortingby_enum"`);
    }

}
