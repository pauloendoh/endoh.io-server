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
exports.Migration1610462961277 = void 0;
class Migration1610462961277 {
    constructor() {
        this.name = 'Migration1610462961277';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "skill_dependency" ("skillId" integer NOT NULL, "dependencyId" integer NOT NULL, CONSTRAINT "PK_bf2a7e98884d471a07b6812971c" PRIMARY KEY ("skillId", "dependencyId"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_fe8bf0dd75148b2fde201059f3" ON "skill_dependency" ("skillId") `);
            yield queryRunner.query(`CREATE INDEX "IDX_b5de330733776ad535e9b41f66" ON "skill_dependency" ("dependencyId") `);
            yield queryRunner.query(`ALTER TABLE "skill_dependency" ADD CONSTRAINT "FK_fe8bf0dd75148b2fde201059f36" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "skill_dependency" ADD CONSTRAINT "FK_b5de330733776ad535e9b41f665" FOREIGN KEY ("dependencyId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "skill_dependency" DROP CONSTRAINT "FK_b5de330733776ad535e9b41f665"`);
            yield queryRunner.query(`ALTER TABLE "skill_dependency" DROP CONSTRAINT "FK_fe8bf0dd75148b2fde201059f36"`);
            yield queryRunner.query(`DROP INDEX "IDX_b5de330733776ad535e9b41f66"`);
            yield queryRunner.query(`DROP INDEX "IDX_fe8bf0dd75148b2fde201059f3"`);
            yield queryRunner.query(`DROP TABLE "skill_dependency"`);
        });
    }
}
exports.Migration1610462961277 = Migration1610462961277;
//# sourceMappingURL=1610462961277-Migration.js.map