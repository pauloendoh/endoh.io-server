import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1607450946893 implements MigrationInterface {
  name = "Migration1607450946893";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(
      `CREATE TABLE "place" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "name" character varying NOT NULL, "icon" character varying NOT NULL, "bgColor" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "expense" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "description" character varying NOT NULL, "name" character varying NOT NULL, "rating" integer, "value" double precision, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "placeId" integer, "categoryId" integer, CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "name" character varying NOT NULL, "icon" character varying NOT NULL, "bgColor" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(
      `ALTER TABLE "place" ADD CONSTRAINT "FK_f6bdcc6c120ebfeeb91e2187082" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "expense" ADD CONSTRAINT "FK_06e076479515578ab1933ab4375" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "expense" ADD CONSTRAINT "FK_43a085294f47ef8a6635dd46699" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "expense" ADD CONSTRAINT "FK_42eea5debc63f4d1bf89881c10a" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_32b856438dffdc269fa84434d9f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );

    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "resource" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "title" character varying NOT NULL, "url" character varying NOT NULL, "thumbnail" character varying NOT NULL, "estimatedTime" character varying NOT NULL, "dueDate" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "tag_resources_resource" ("tagId" integer NOT NULL, "resourceId" integer NOT NULL, CONSTRAINT "PK_9f2192e61879c558b072dba1639" PRIMARY KEY ("tagId", "resourceId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8b6b0d8111416f4b343921b201" ON "tag_resources_resource" ("tagId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a17163c986a1374dfb12681115" ON "tag_resources_resource" ("resourceId") `
    );
    await queryRunner.query(
      `ALTER TABLE "tag" ADD CONSTRAINT "FK_d0dc39ff83e384b4a097f47d3f5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "resource" ADD CONSTRAINT "FK_77a300816e77fa9fdca6879c4d1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "tag_resources_resource" ADD CONSTRAINT "FK_8b6b0d8111416f4b343921b201f" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "tag_resources_resource" ADD CONSTRAINT "FK_a17163c986a1374dfb126811157" FOREIGN KEY ("resourceId") REFERENCES "resource"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tag_resources_resource" DROP CONSTRAINT "FK_a17163c986a1374dfb126811157"`
    );
    await queryRunner.query(
      `ALTER TABLE "tag_resources_resource" DROP CONSTRAINT "FK_8b6b0d8111416f4b343921b201f"`
    );
    await queryRunner.query(
      `ALTER TABLE "resource" DROP CONSTRAINT "FK_77a300816e77fa9fdca6879c4d1"`
    );
    await queryRunner.query(
      `ALTER TABLE "tag" DROP CONSTRAINT "FK_d0dc39ff83e384b4a097f47d3f5"`
    );
    await queryRunner.query(`DROP INDEX "IDX_a17163c986a1374dfb12681115"`);
    await queryRunner.query(`DROP INDEX "IDX_8b6b0d8111416f4b343921b201"`);
    await queryRunner.query(`DROP TABLE "tag_resources_resource"`);
    await queryRunner.query(`DROP TABLE "resource"`);
    await queryRunner.query(`DROP TABLE "tag"`);

    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_32b856438dffdc269fa84434d9f"`
    );
    await queryRunner.query(
      `ALTER TABLE "expense" DROP CONSTRAINT "FK_42eea5debc63f4d1bf89881c10a"`
    );
    await queryRunner.query(
      `ALTER TABLE "expense" DROP CONSTRAINT "FK_43a085294f47ef8a6635dd46699"`
    );
    await queryRunner.query(
      `ALTER TABLE "expense" DROP CONSTRAINT "FK_06e076479515578ab1933ab4375"`
    );
    await queryRunner.query(
      `ALTER TABLE "place" DROP CONSTRAINT "FK_f6bdcc6c120ebfeeb91e2187082"`
    );

    await queryRunner.query(`DROP TABLE "user"`);
  }
}
