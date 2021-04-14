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
exports.Migration1610538859429 = void 0;
class Migration1610538859429 {
    constructor() {
        this.name = 'Migration1610538859429';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "skill_tag" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "isPriority" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL DEFAULT '', "color" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_baf77b4425a5a17eedf05a97d23" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "skill_tag" ADD CONSTRAINT "FK_d242569f4f2845158d5dddceeb0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "skill_tag" DROP CONSTRAINT "FK_d242569f4f2845158d5dddceeb0"`);
            yield queryRunner.query(`DROP TABLE "skill_tag"`);
        });
    }
}
exports.Migration1610538859429 = Migration1610538859429;
//# sourceMappingURL=1610538859429-Migration.js.map