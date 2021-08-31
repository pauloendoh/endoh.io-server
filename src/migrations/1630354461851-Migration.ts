import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1630354461851 implements MigrationInterface {
    name = 'Migration1630354461851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "champion_radar" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "championId" integer NOT NULL, "dps" integer NOT NULL, "burst" integer NOT NULL, "tankiness" integer NOT NULL, "engage" integer NOT NULL, "protect" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e0631644e7579ffe0f150bcd505" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "champion_radar" ADD CONSTRAINT "FK_07c5c1b5dba28d4d8adc32bd083" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "champion_radar" ADD CONSTRAINT "FK_2919f4dc7813046bba0b2ec2740" FOREIGN KEY ("championId") REFERENCES "champion"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "champion_radar" DROP CONSTRAINT "FK_2919f4dc7813046bba0b2ec2740"`);
        await queryRunner.query(`ALTER TABLE "champion_radar" DROP CONSTRAINT "FK_07c5c1b5dba28d4d8adc32bd083"`);
        await queryRunner.query(`DROP TABLE "champion_radar"`);
    }

}
