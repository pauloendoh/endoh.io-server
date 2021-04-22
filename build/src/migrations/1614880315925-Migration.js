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
exports.Migration1614880315925 = void 0;
class Migration1614880315925 {
    constructor() {
        this.name = 'Migration1614880315925';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "user_suggestion" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "suggestedUserId" integer NOT NULL, "description" character varying NOT NULL DEFAULT '', "dontShowUntil" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5a2113e801359990458de57ec53" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "user_suggestion" ADD CONSTRAINT "FK_2003c1fd62a36fca9eaf90b0309" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE "user_suggestion" ADD CONSTRAINT "FK_bfbf8de93c456dec8d56db228ee" FOREIGN KEY ("suggestedUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "user_suggestion" DROP CONSTRAINT "FK_bfbf8de93c456dec8d56db228ee"`);
            yield queryRunner.query(`ALTER TABLE "user_suggestion" DROP CONSTRAINT "FK_2003c1fd62a36fca9eaf90b0309"`);
            yield queryRunner.query(`DROP TABLE "user_suggestion"`);
        });
    }
}
exports.Migration1614880315925 = Migration1614880315925;
//# sourceMappingURL=1614880315925-Migration.js.map