import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1651003251268 implements MigrationInterface {
    name = 'Migration1651003251268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "skill_history" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "skillId" integer NOT NULL, "skillName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6e874dbf6405f9e26a0194be44a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "skill_history" ADD CONSTRAINT "FK_6568a2b13057bf479a564be2c68" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "skill_history" DROP CONSTRAINT "FK_6568a2b13057bf479a564be2c68"`);
        await queryRunner.query(`DROP TABLE "skill_history"`);
    }

}
