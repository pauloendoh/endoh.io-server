"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1614726826731 = void 0;
class Migration1614726826731 {
    constructor() {
        this.name = 'Migration1614726826731';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "following_tag" ("id" SERIAL NOT NULL, "followerId" integer NOT NULL, "followingUserId" integer NOT NULL, "tagId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e9d9ed02319128ec05d1fb3ac08" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
            yield queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "userId" SET NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "following_tag" ADD CONSTRAINT "FK_95c5d93f0dba83133ca0f72ad83" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "following_tag" ADD CONSTRAINT "FK_3097ffcb3a4e826e789736f1d29" FOREIGN KEY ("followingUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "following_tag" ADD CONSTRAINT "FK_bc15ed71a3f71c7f43c2f700cb1" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_a24972ebd73b106250713dcddd9"`);
            yield queryRunner.query(`ALTER TABLE "following_tag" DROP CONSTRAINT "FK_bc15ed71a3f71c7f43c2f700cb1"`);
            yield queryRunner.query(`ALTER TABLE "following_tag" DROP CONSTRAINT "FK_3097ffcb3a4e826e789736f1d29"`);
            yield queryRunner.query(`ALTER TABLE "following_tag" DROP CONSTRAINT "FK_95c5d93f0dba83133ca0f72ad83"`);
            yield queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "userId" DROP NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_a24972ebd73b106250713dcddd9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`DROP TABLE "following_tag"`);
        });
    }
}
exports.Migration1614726826731 = Migration1614726826731;
//# sourceMappingURL=1614726826731-Migration.js.map