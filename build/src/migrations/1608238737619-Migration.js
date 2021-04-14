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
exports.Migration1608238737619 = void 0;
class Migration1608238737619 {
    constructor() {
        this.name = 'Migration1608238737619';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "rating" DROP NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "rating" DROP DEFAULT`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "resource" ALTER COLUMN "rating" SET DEFAULT 0`);
            yield queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "rating" SET NOT NULL`);
        });
    }
}
exports.Migration1608238737619 = Migration1608238737619;
//# sourceMappingURL=1608238737619-Migration.js.map