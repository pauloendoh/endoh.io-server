import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1665769215432 implements MigrationInterface {
    name = 'Migration1665769215432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" ADD "toRefine" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "note" DROP COLUMN "toRefine"`);
    }

}
