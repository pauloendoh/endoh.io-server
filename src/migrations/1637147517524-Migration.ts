import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1637147517524 implements MigrationInterface {
    name = 'Migration1637147517524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "friend" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_1b301ac8ac5fcee876db96069b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "friend" ADD CONSTRAINT "FK_855044ea856e46f62a46acebd65" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friend" DROP CONSTRAINT "FK_855044ea856e46f62a46acebd65"`);
        await queryRunner.query(`DROP TABLE "friend"`);
    }

}
