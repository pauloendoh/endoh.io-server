import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1680569850756 implements MigrationInterface {
    name = 'Migration1680569850756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mal_user_similarity" ("id" SERIAL NOT NULL, "usernameA" character varying NOT NULL, "usernameB" character varying NOT NULL, "animeSimiliarity" double precision NOT NULL, "animeCount" integer NOT NULL, "mangaSimiliarity" double precision NOT NULL, "mangaCount" integer NOT NULL, "lastScraped" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f6e760987ac910b3d86ea817f52" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "mal_user_similarity"`);
    }

}
