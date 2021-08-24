import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1612892521413 implements MigrationInterface {
    name = 'Migration1612892521413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" ADD "isPrivate" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "isPrivate"`);
    }

}
