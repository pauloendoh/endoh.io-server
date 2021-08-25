import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1629857779620 implements MigrationInterface {
    name = 'Migration1629857779620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_champion" ADD "championId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "player_champion" ADD CONSTRAINT "FK_b18f42ae307c9ed25351a90234c" FOREIGN KEY ("championId") REFERENCES "champion"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_champion" DROP CONSTRAINT "FK_b18f42ae307c9ed25351a90234c"`);
        await queryRunner.query(`ALTER TABLE "player_champion" DROP COLUMN "championId"`);
    }

}
