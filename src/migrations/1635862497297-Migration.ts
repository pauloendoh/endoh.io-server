import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1635862497297 implements MigrationInterface {
    name = 'Migration1635862497297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "folder_closure" ("id_ancestor" integer NOT NULL, "id_descendant" integer NOT NULL, CONSTRAINT "PK_ea15eee69fbb40458fe66545447" PRIMARY KEY ("id_ancestor", "id_descendant"))`);
        await queryRunner.query(`CREATE INDEX "IDX_073b49e13e4ebe5c294443a16b" ON "folder_closure" ("id_ancestor") `);
        await queryRunner.query(`CREATE INDEX "IDX_fe732379b449e3dc89f52b8b44" ON "folder_closure" ("id_descendant") `);
        await queryRunner.query(`ALTER TABLE "public"."folder" DROP COLUMN "nsleft"`);
        await queryRunner.query(`ALTER TABLE "public"."folder" DROP COLUMN "nsright"`);
        await queryRunner.query(`ALTER TABLE "folder_closure" ADD CONSTRAINT "FK_073b49e13e4ebe5c294443a16b4" FOREIGN KEY ("id_ancestor") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "folder_closure" ADD CONSTRAINT "FK_fe732379b449e3dc89f52b8b441" FOREIGN KEY ("id_descendant") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folder_closure" DROP CONSTRAINT "FK_fe732379b449e3dc89f52b8b441"`);
        await queryRunner.query(`ALTER TABLE "folder_closure" DROP CONSTRAINT "FK_073b49e13e4ebe5c294443a16b4"`);
        await queryRunner.query(`ALTER TABLE "public"."folder" ADD "nsright" integer NOT NULL DEFAULT '2'`);
        await queryRunner.query(`ALTER TABLE "public"."folder" ADD "nsleft" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`DROP INDEX "IDX_fe732379b449e3dc89f52b8b44"`);
        await queryRunner.query(`DROP INDEX "IDX_073b49e13e4ebe5c294443a16b"`);
        await queryRunner.query(`DROP TABLE "folder_closure"`);
    }

}
