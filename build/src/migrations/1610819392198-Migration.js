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
exports.Migration1610819392198 = void 0;
class Migration1610819392198 {
    constructor() {
        this.name = 'Migration1610819392198';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "tag" ADD "position" integer`);
            yield queryRunner.query(`ALTER TABLE "tag" ADD "color" character varying NOT NULL DEFAULT '#424242'`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "color"`);
            yield queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "position"`);
        });
    }
}
exports.Migration1610819392198 = Migration1610819392198;
//# sourceMappingURL=1610819392198-Migration.js.map