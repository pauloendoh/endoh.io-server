import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1607911728358 implements MigrationInterface {
    name = 'Migration1607911728358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" RENAME COLUMN "positionAtTag" TO "position"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resource" RENAME COLUMN "position" TO "positionAtTag"`);
    }

}
