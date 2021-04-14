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
exports.Migration1607699741924 = void 0;
class Migration1607699741924 {
    constructor() {
        this.name = 'Migration1607699741924';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "resource" ADD "tagId" integer`);
            yield queryRunner.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_5d7f5222e6ff450caa2d8ba4d6a" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_5d7f5222e6ff450caa2d8ba4d6a"`);
            yield queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "tagId"`);
        });
    }
}
exports.Migration1607699741924 = Migration1607699741924;
//# sourceMappingURL=1607699741924-Migration.js.map