import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1629856136690 implements MigrationInterface {
    name = 'Migration1629856136690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "player_champion" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "playerId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1aac43e519be660ed6a6cbc468" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "player_champion" ADD CONSTRAINT "FK_ae53701c41f1aa0839d052c33cd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_champion" ADD CONSTRAINT "FK_300845b42b94fcc82366a98b3e4" FOREIGN KEY ("playerId") REFERENCES "player"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_champion" DROP CONSTRAINT "FK_300845b42b94fcc82366a98b3e4"`);
        await queryRunner.query(`ALTER TABLE "player_champion" DROP CONSTRAINT "FK_ae53701c41f1aa0839d052c33cd"`);
        await queryRunner.query(`DROP TABLE "player_champion"`);
    }

}
