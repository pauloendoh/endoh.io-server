import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722899892198 implements MigrationInterface {
    name = 'Migration1722899892198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_960e423bd8c1f0d9913bc1c099e"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b"`);
        await queryRunner.query(`ALTER TABLE "skill" ADD "discomfortZone" double precision`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "question_id_seq" OWNED BY "question"."id"`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "id" SET DEFAULT nextval('"question_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_80f29cc01d0bd1644e389cc13be" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_70f9da8788aa253b76bb919c872" FOREIGN KEY ("docId") REFERENCES "doc"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_70f9da8788aa253b76bb919c872"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_80f29cc01d0bd1644e389cc13be"`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "id" SET DEFAULT nextval('note_id_seq')`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "question_id_seq"`);
        await queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "discomfortZone"`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_960e423bd8c1f0d9913bc1c099e" FOREIGN KEY ("docId") REFERENCES "doc"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
