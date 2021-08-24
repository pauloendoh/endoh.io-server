import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1608118214653 implements MigrationInterface {
    name = 'Migration1608118214653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_5d7f5222e6ff450caa2d8ba4d6a"`);
        await queryRunner.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_5d7f5222e6ff450caa2d8ba4d6a" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_5d7f5222e6ff450caa2d8ba4d6a"`);
        await queryRunner.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_5d7f5222e6ff450caa2d8ba4d6a" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
