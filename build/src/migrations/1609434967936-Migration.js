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
exports.Migration1609434967936 = void 0;
class Migration1609434967936 {
    constructor() {
        this.name = 'Migration1609434967936';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "user" ADD "googleId" character varying`);
            yield queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_470355432cc67b2c470c30bef7c" UNIQUE ("googleId")`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_470355432cc67b2c470c30bef7c"`);
            yield queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleId"`);
        });
    }
}
exports.Migration1609434967936 = Migration1609434967936;
//# sourceMappingURL=1609434967936-Migration.js.map