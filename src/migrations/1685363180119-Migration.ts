import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1685363180119 implements MigrationInterface {
    name = 'Migration1685363180119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "last_seen_resource" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "lastSeenAt" character varying NOT NULL, CONSTRAINT "REL_74b8916d63a27a69ef7c2f0f4f" UNIQUE ("userId"), CONSTRAINT "PK_9337c172583226bba88b73e3192" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "last_seen_resource" ADD CONSTRAINT "FK_74b8916d63a27a69ef7c2f0f4f4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "last_seen_resource" DROP CONSTRAINT "FK_74b8916d63a27a69ef7c2f0f4f4"`);
        await queryRunner.query(`DROP TABLE "last_seen_resource"`);
    }

}
