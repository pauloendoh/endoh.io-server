import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1610642187569 implements MigrationInterface {
    name = 'Migration1610642187569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_c0d4158b81ff40e83503ffed8ab"`);
        await queryRunner.query(`ALTER TABLE "skill" RENAME COLUMN "skillTagId" TO "tagId"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_013750d508fe03dc1fc89106d4c" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_013750d508fe03dc1fc89106d4c"`);
        await queryRunner.query(`ALTER TABLE "skill" RENAME COLUMN "tagId" TO "skillTagId"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_c0d4158b81ff40e83503ffed8ab" FOREIGN KEY ("skillTagId") REFERENCES "skill_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
