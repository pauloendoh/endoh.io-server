import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1610462961277 implements MigrationInterface {
    name = 'Migration1610462961277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "skill_dependency" ("skillId" integer NOT NULL, "dependencyId" integer NOT NULL, CONSTRAINT "PK_bf2a7e98884d471a07b6812971c" PRIMARY KEY ("skillId", "dependencyId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fe8bf0dd75148b2fde201059f3" ON "skill_dependency" ("skillId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b5de330733776ad535e9b41f66" ON "skill_dependency" ("dependencyId") `);
        await queryRunner.query(`ALTER TABLE "skill_dependency" ADD CONSTRAINT "FK_fe8bf0dd75148b2fde201059f36" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "skill_dependency" ADD CONSTRAINT "FK_b5de330733776ad535e9b41f665" FOREIGN KEY ("dependencyId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill_dependency" DROP CONSTRAINT "FK_b5de330733776ad535e9b41f665"`);
        await queryRunner.query(`ALTER TABLE "skill_dependency" DROP CONSTRAINT "FK_fe8bf0dd75148b2fde201059f36"`);
        await queryRunner.query(`DROP INDEX "IDX_b5de330733776ad535e9b41f66"`);
        await queryRunner.query(`DROP INDEX "IDX_fe8bf0dd75148b2fde201059f3"`);
        await queryRunner.query(`DROP TABLE "skill_dependency"`);
    }

}
