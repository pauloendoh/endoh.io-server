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
exports.Migration1610926333333 = void 0;
class Migration1610926333333 {
    constructor() {
        this.name = 'Migration1610926333333';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "skill_progress" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "skillId" integer NOT NULL, "oldLevel" integer, "newLevel" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_69253717fa7ce8e8fed5c237b5f" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "skill_progress" ADD CONSTRAINT "FK_bb0b9f98daada1b9141bd24fa06" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "skill_progress" ADD CONSTRAINT "FK_e266d46764298f1e0b2f4e4b629" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "skill_progress" DROP CONSTRAINT "FK_e266d46764298f1e0b2f4e4b629"`);
            yield queryRunner.query(`ALTER TABLE "skill_progress" DROP CONSTRAINT "FK_bb0b9f98daada1b9141bd24fa06"`);
            yield queryRunner.query(`DROP TABLE "skill_progress"`);
        });
    }
}
exports.Migration1610926333333 = Migration1610926333333;
//# sourceMappingURL=1610926333333-Migration.js.map