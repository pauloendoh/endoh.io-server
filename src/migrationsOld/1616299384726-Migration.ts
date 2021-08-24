import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1616299384726 implements MigrationInterface {
    name = 'Migration1616299384726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "followerId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "UQ_a7f555f9c2f9d82073510b0ffc0" UNIQUE ("followerId")`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_a7f555f9c2f9d82073510b0ffc0" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_a7f555f9c2f9d82073510b0ffc0"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "UQ_a7f555f9c2f9d82073510b0ffc0"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "followerId"`);
    }

}
