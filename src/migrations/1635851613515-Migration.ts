import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1635851613515 implements MigrationInterface {
    name = 'Migration1635851613515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "folder" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "nsleft" integer NOT NULL DEFAULT '1', "nsright" integer NOT NULL DEFAULT '2', "parentFolderId" integer, CONSTRAINT "PK_6278a41a706740c94c02e288df8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "parentFolderId" integer NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."drag_item" DROP CONSTRAINT "FK_67956a31b445a1707c26ca99edc"`);
        await queryRunner.query(`ALTER TABLE "public"."drag_item" ALTER COLUMN "containerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."drag_item" ADD CONSTRAINT "FK_67956a31b445a1707c26ca99edc" FOREIGN KEY ("containerId") REFERENCES "drag_container"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "FK_a0ef64d088bc677d66b9231e90b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "FK_804ea52f6729e3940498bd54d78" FOREIGN KEY ("parentFolderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_b2d8e683f020f61115edea206b3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_e200f72a091529f8003adb97742" FOREIGN KEY ("parentFolderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_e200f72a091529f8003adb97742"`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_b2d8e683f020f61115edea206b3"`);
        await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "FK_804ea52f6729e3940498bd54d78"`);
        await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "FK_a0ef64d088bc677d66b9231e90b"`);
        await queryRunner.query(`ALTER TABLE "public"."drag_item" DROP CONSTRAINT "FK_67956a31b445a1707c26ca99edc"`);
        await queryRunner.query(`ALTER TABLE "public"."drag_item" ALTER COLUMN "containerId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."drag_item" ADD CONSTRAINT "FK_67956a31b445a1707c26ca99edc" FOREIGN KEY ("containerId") REFERENCES "drag_container"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "file"`);
        await queryRunner.query(`DROP TABLE "folder"`);
    }

}
