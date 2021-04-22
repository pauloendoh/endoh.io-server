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
exports.Migration1610831565937 = void 0;
class Migration1610831565937 {
    constructor() {
        this.name = 'Migration1610831565937';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "user_preference" ("id" SERIAL NOT NULL, "relearnAutofillURL" boolean NOT NULL DEFAULT true, "relearnLastAccessedRoute" character varying NOT NULL DEFAULT '/', "skillbaseSidebarIsOpen" boolean NOT NULL DEFAULT false, "skillbaseSortSkill" text, "skillbaseTextFilter" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_5b141fbd1fef95a0540f7e7d1e" UNIQUE ("userId"), CONSTRAINT "PK_0532217bd629d0ccf06499c5841" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "user_preference" ADD CONSTRAINT "FK_5b141fbd1fef95a0540f7e7d1e2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "user_preference" DROP CONSTRAINT "FK_5b141fbd1fef95a0540f7e7d1e2"`);
            yield queryRunner.query(`DROP TABLE "user_preference"`);
        });
    }
}
exports.Migration1610831565937 = Migration1610831565937;
//# sourceMappingURL=1610831565937-Migration.js.map