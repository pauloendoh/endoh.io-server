import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1679921693153 implements MigrationInterface {
    name = 'Migration1679921693153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_aram_champion" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "championId" integer NOT NULL, "fun" integer NOT NULL, "runes" character varying NOT NULL, "items" character varying NOT NULL, "extraNotes" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ef8e17c399874cf43bccae940f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_aram_champion" ADD CONSTRAINT "FK_d62435409ffe8e4fa0e177a0791" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_aram_champion" ADD CONSTRAINT "FK_b825890206f0b8fce0b299da007" FOREIGN KEY ("championId") REFERENCES "champion"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_aram_champion" DROP CONSTRAINT "FK_b825890206f0b8fce0b299da007"`);
        await queryRunner.query(`ALTER TABLE "user_aram_champion" DROP CONSTRAINT "FK_d62435409ffe8e4fa0e177a0791"`);
        await queryRunner.query(`DROP TABLE "user_aram_champion"`);
    }

}
