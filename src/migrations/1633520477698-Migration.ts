import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1633520477698 implements MigrationInterface {
    name = 'Migration1633520477698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."skill_dependency" DROP CONSTRAINT "FK_b5de330733776ad535e9b41f665"`);
        await queryRunner.query(`ALTER TABLE "public"."skill_dependency" DROP CONSTRAINT "FK_fe8bf0dd75148b2fde201059f36"`);
        await queryRunner.query(`ALTER TABLE "public"."test" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."test" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."test" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."test" ADD CONSTRAINT "FK_394889f330e608a61edd1163cdf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."skill_dependency" ADD CONSTRAINT "FK_fe8bf0dd75148b2fde201059f36" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "public"."skill_dependency" ADD CONSTRAINT "FK_b5de330733776ad535e9b41f665" FOREIGN KEY ("dependencyId") REFERENCES "skill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."skill_dependency" DROP CONSTRAINT "FK_b5de330733776ad535e9b41f665"`);
        await queryRunner.query(`ALTER TABLE "public"."skill_dependency" DROP CONSTRAINT "FK_fe8bf0dd75148b2fde201059f36"`);
        await queryRunner.query(`ALTER TABLE "public"."test" DROP CONSTRAINT "FK_394889f330e608a61edd1163cdf"`);
        await queryRunner.query(`ALTER TABLE "public"."test" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "public"."test" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "public"."test" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "public"."skill_dependency" ADD CONSTRAINT "FK_fe8bf0dd75148b2fde201059f36" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."skill_dependency" ADD CONSTRAINT "FK_b5de330733776ad535e9b41f665" FOREIGN KEY ("dependencyId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
