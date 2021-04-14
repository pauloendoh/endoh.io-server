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
exports.Migration1607693344309 = void 0;
class Migration1607693344309 {
    constructor() {
        this.name = 'Migration1607693344309';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "resource" ADD "completedAt" character varying NOT NULL DEFAULT ''`);
            yield queryRunner.query(`ALTER TABLE "resource" ADD "positionAtTag" integer`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "positionAtTag"`);
            yield queryRunner.query(`ALTER TABLE "resource" DROP COLUMN "completedAt"`);
        });
    }
}
exports.Migration1607693344309 = Migration1607693344309;
//# sourceMappingURL=1607693344309-Migration.js.map