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
exports.Migration1616278486339 = void 0;
class Migration1616278486339 {
    constructor() {
        this.name = 'Migration1616278486339';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "picture"`);
            yield queryRunner.query(`ALTER TABLE "profile" ADD "pictureUrl" character varying NOT NULL DEFAULT ''`);
            yield queryRunner.query(`ALTER TABLE "profile" ADD "pictureName" character varying NOT NULL DEFAULT ''`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "pictureName"`);
            yield queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "pictureUrl"`);
            yield queryRunner.query(`ALTER TABLE "profile" ADD "picture" character varying NOT NULL DEFAULT ''`);
        });
    }
}
exports.Migration1616278486339 = Migration1616278486339;
//# sourceMappingURL=1616278486339-Migration.js.map