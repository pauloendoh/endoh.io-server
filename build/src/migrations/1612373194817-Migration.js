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
exports.Migration1612373194817 = void 0;
class Migration1612373194817 {
    constructor() {
        this.name = 'Migration1612373194817';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_013750d508fe03dc1fc89106d4c"`);
            yield queryRunner.query(`ALTER TABLE "resource" ADD "publicReview" character varying NOT NULL DEFAULT ''`);
            yield queryRunner.query(`ALTER TABLE "resource" ADD "privateNote" character varying NOT NULL DEFAULT ''`);
            yield queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_013750d508fe03dc1fc89106d4c" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_013750d508fe03dc1fc89106d4c"`);
            yield queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "privateNote"`);
            yield queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "publicReview"`);
            yield queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_013750d508fe03dc1fc89106d4c" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
}
exports.Migration1612373194817 = Migration1612373194817;
//# sourceMappingURL=1612373194817-Migration.js.map