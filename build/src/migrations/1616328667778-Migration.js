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
exports.Migration1616328667778 = void 0;
class Migration1616328667778 {
    constructor() {
        this.name = 'Migration1616328667778';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`);
            yield queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_a7f555f9c2f9d82073510b0ffc0"`);
            yield queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "REL_1ced25315eb974b73391fb1c81"`);
            yield queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "UQ_a7f555f9c2f9d82073510b0ffc0"`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "UQ_a7f555f9c2f9d82073510b0ffc0" UNIQUE ("followerId")`);
            yield queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "REL_1ced25315eb974b73391fb1c81" UNIQUE ("userId")`);
            yield queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_a7f555f9c2f9d82073510b0ffc0" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
}
exports.Migration1616328667778 = Migration1616328667778;
//# sourceMappingURL=1616328667778-Migration.js.map