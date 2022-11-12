import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1668281363173 implements MigrationInterface {
    name = 'Migration1668281363173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_got_it" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "createTag" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_24ee3c9aee238b0d597560c861" UNIQUE ("userId"), CONSTRAINT "PK_6d1d60c2f6ac63238d297943083" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_got_it" ADD CONSTRAINT "FK_24ee3c9aee238b0d597560c8610" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_got_it" DROP CONSTRAINT "FK_24ee3c9aee238b0d597560c8610"`);
        await queryRunner.query(`DROP TABLE "user_got_it"`);
    }

}
