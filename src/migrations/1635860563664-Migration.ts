import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1635860563664 implements MigrationInterface {
    name = 'Migration1635860563664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."folder" DROP CONSTRAINT "FK_804ea52f6729e3940498bd54d78"`);
        await queryRunner.query(`ALTER TABLE "public"."folder" ALTER COLUMN "parentFolderId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."folder" ADD CONSTRAINT "FK_804ea52f6729e3940498bd54d78" FOREIGN KEY ("parentFolderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."folder" DROP CONSTRAINT "FK_804ea52f6729e3940498bd54d78"`);
        await queryRunner.query(`ALTER TABLE "public"."folder" ALTER COLUMN "parentFolderId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."folder" ADD CONSTRAINT "FK_804ea52f6729e3940498bd54d78" FOREIGN KEY ("parentFolderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
