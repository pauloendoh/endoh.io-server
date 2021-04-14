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
exports.Migration1607546080191 = void 0;
class Migration1607546080191 {
    constructor() {
        this.name = 'Migration1607546080191';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "resource" ADD "rating" integer NOT NULL DEFAULT 0`);
            yield queryRunner.query(`ALTER TABLE "resource" ADD "isCompleted" boolean NOT NULL DEFAULT false`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "isCompleted"`);
            yield queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "rating"`);
        });
    }
}
exports.Migration1607546080191 = Migration1607546080191;
//# sourceMappingURL=1607546080191-Migration.js.map