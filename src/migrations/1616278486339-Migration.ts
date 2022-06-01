import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1616278486339 implements MigrationInterface {
    name = 'Migration1616278486339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "picture"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "pictureUrl" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "pictureName" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "pictureName"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "pictureUrl"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "picture" character varying NOT NULL DEFAULT ''`);
    }

}
