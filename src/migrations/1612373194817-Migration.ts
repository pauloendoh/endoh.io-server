import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1612373194817 implements MigrationInterface {
    name = 'Migration1612373194817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_013750d508fe03dc1fc89106d4c"`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "publicReview" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "resource" ADD "privateNote" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_013750d508fe03dc1fc89106d4c" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_013750d508fe03dc1fc89106d4c"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "privateNote"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "publicReview"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_013750d508fe03dc1fc89106d4c" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
