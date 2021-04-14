"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1607450946893 = void 0;
class Migration1607450946893 {
    constructor() {
        this.name = 'Migration1607450946893';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "resource" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "title" character varying NOT NULL, "url" character varying NOT NULL, "thumbnail" character varying NOT NULL, "estimatedTime" character varying NOT NULL, "dueDate" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag_resources_resource" ("tagId" integer NOT NULL, "resourceId" integer NOT NULL, CONSTRAINT "PK_9f2192e61879c558b072dba1639" PRIMARY KEY ("tagId", "resourceId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8b6b0d8111416f4b343921b201" ON "tag_resources_resource" ("tagId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a17163c986a1374dfb12681115" ON "tag_resources_resource" ("resourceId") `);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_d0dc39ff83e384b4a097f47d3f5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_77a300816e77fa9fdca6879c4d1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag_resources_resource" ADD CONSTRAINT "FK_8b6b0d8111416f4b343921b201f" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tag_resources_resource" ADD CONSTRAINT "FK_a17163c986a1374dfb126811157" FOREIGN KEY ("resourceId") REFERENCES "resource"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "tag_resources_resource" DROP CONSTRAINT "FK_a17163c986a1374dfb126811157"`);
        await queryRunner.query(`ALTER TABLE "tag_resources_resource" DROP CONSTRAINT "FK_8b6b0d8111416f4b343921b201f"`);
        await queryRunner.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_77a300816e77fa9fdca6879c4d1"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_d0dc39ff83e384b4a097f47d3f5"`);
        await queryRunner.query(`DROP INDEX "IDX_a17163c986a1374dfb12681115"`);
        await queryRunner.query(`DROP INDEX "IDX_8b6b0d8111416f4b343921b201"`);
        await queryRunner.query(`DROP TABLE "tag_resources_resource"`);
        await queryRunner.query(`DROP TABLE "resource"`);
        await queryRunner.query(`DROP TABLE "tag"`);
    }
}
exports.Migration1607450946893 = Migration1607450946893;
//# sourceMappingURL=1607450946893-Migration.js.map