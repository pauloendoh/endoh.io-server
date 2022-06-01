import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1607452207029 implements MigrationInterface {
    name = 'Migration1607452207029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" RENAME COLUMN "nameBazzinga" TO "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" RENAME COLUMN "name" TO "nameBazzinga"`);
    }

}
