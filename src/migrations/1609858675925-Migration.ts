import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1609858675925 implements MigrationInterface {
    name = 'Migration1609858675925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "o_auth_token" DROP CONSTRAINT "FK_cacccc1796e11c9350fc1544328"`);
        await queryRunner.query(`DROP TABLE "o_auth_token"`);
        
        await queryRunner.query(`CREATE TABLE "user_token" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "type" character varying NOT NULL, "token" character varying NOT NULL, "expiresAt" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_48cb6b5c20faa63157b3c1baf7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_token" ADD CONSTRAINT "FK_d37db50eecdf9b8ce4eedd2f918" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_token" DROP CONSTRAINT "FK_d37db50eecdf9b8ce4eedd2f918"`);
        await queryRunner.query(`DROP TABLE "user_token"`);
    }

}
