import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1610539873611 implements MigrationInterface {
    name = 'Migration1610539873611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" ADD "skillTagId" integer`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_c0d4158b81ff40e83503ffed8ab" FOREIGN KEY ("skillTagId") REFERENCES "skill_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_c0d4158b81ff40e83503ffed8ab"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "skillTagId"`);
    }

}
