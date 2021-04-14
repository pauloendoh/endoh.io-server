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
exports.Migration1609781250597 = void 0;
class Migration1609781250597 {
    constructor() {
        this.name = 'Migration1609781250597';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "o_auth_token" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "token" character varying NOT NULL, "expiresAt" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f627e7380e58f41d1157094c0d3" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "o_auth_token" ADD CONSTRAINT "FK_cacccc1796e11c9350fc1544328" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "o_auth_token" DROP CONSTRAINT "FK_cacccc1796e11c9350fc1544328"`);
            yield queryRunner.query(`DROP TABLE "o_auth_token"`);
        });
    }
}
exports.Migration1609781250597 = Migration1609781250597;
//# sourceMappingURL=1609781250597-Migration.js.map