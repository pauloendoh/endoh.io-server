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
exports.Migration1610539873611 = void 0;
class Migration1610539873611 {
    constructor() {
        this.name = 'Migration1610539873611';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "skill" ADD "skillTagId" integer`);
            yield queryRunner.query(`ALTER TABLE "skill" ADD CONSTRAINT "FK_c0d4158b81ff40e83503ffed8ab" FOREIGN KEY ("skillTagId") REFERENCES "skill_tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "skill" DROP CONSTRAINT "FK_c0d4158b81ff40e83503ffed8ab"`);
            yield queryRunner.query(`ALTER TABLE "skill" DROP COLUMN "skillTagId"`);
        });
    }
}
exports.Migration1610539873611 = Migration1610539873611;
//# sourceMappingURL=1610539873611-Migration.js.map