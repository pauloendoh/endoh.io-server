import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1635098652417 implements MigrationInterface {
    name = 'Migration1635098652417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "drag_item" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL DEFAULT '', "position" integer NOT NULL, "containerId" integer, CONSTRAINT "PK_7cbc98bcd302bc882531e307191" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "drag_container" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL DEFAULT '', "position" integer NOT NULL, CONSTRAINT "PK_47e7993d8fdd4ce9fad75999efe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "drag_item" ADD CONSTRAINT "FK_be44546771fdc7c58dd6b855235" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drag_item" ADD CONSTRAINT "FK_67956a31b445a1707c26ca99edc" FOREIGN KEY ("containerId") REFERENCES "drag_container"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drag_container" ADD CONSTRAINT "FK_1e635526a21bea064ba4aa260ea" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drag_container" DROP CONSTRAINT "FK_1e635526a21bea064ba4aa260ea"`);
        await queryRunner.query(`ALTER TABLE "drag_item" DROP CONSTRAINT "FK_67956a31b445a1707c26ca99edc"`);
        await queryRunner.query(`ALTER TABLE "drag_item" DROP CONSTRAINT "FK_be44546771fdc7c58dd6b855235"`);
        await queryRunner.query(`DROP TABLE "drag_container"`);
        await queryRunner.query(`DROP TABLE "drag_item"`);
    }

}
