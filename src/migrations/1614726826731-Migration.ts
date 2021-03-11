import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1614726826731 implements MigrationInterface {
    name = 'Migration1614726826731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "following_tag" ("id" SERIAL NOT NULL, "followerId" integer NOT NULL, "followingUserId" integer NOT NULL, "tagId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e9d9ed02319128ec05d1fb3ac08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "following_tag" ADD CONSTRAINT "FK_95c5d93f0dba83133ca0f72ad83" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "following_tag" ADD CONSTRAINT "FK_3097ffcb3a4e826e789736f1d29" FOREIGN KEY ("followingUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "following_tag" ADD CONSTRAINT "FK_bc15ed71a3f71c7f43c2f700cb1" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
        await queryRunner.query(`ALTER TABLE "following_tag" DROP CONSTRAINT "FK_bc15ed71a3f71c7f43c2f700cb1"`);
        await queryRunner.query(`ALTER TABLE "following_tag" DROP CONSTRAINT "FK_3097ffcb3a4e826e789736f1d29"`);
        await queryRunner.query(`ALTER TABLE "following_tag" DROP CONSTRAINT "FK_95c5d93f0dba83133ca0f72ad83"`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "following_tag"`);
    }

}
