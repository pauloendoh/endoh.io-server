"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1614880315925 = void 0;
class Migration1614880315925 {
    constructor() {
        this.name = 'Migration1614880315925';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user_suggestion" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "suggestedUserId" integer NOT NULL, "description" character varying NOT NULL DEFAULT '', "dontShowUntil" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5a2113e801359990458de57ec53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_suggestion" ADD CONSTRAINT "FK_2003c1fd62a36fca9eaf90b0309" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_suggestion" ADD CONSTRAINT "FK_bfbf8de93c456dec8d56db228ee" FOREIGN KEY ("suggestedUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_suggestion" DROP CONSTRAINT "FK_bfbf8de93c456dec8d56db228ee"`);
        await queryRunner.query(`ALTER TABLE "user_suggestion" DROP CONSTRAINT "FK_2003c1fd62a36fca9eaf90b0309"`);
        await queryRunner.query(`DROP TABLE "user_suggestion"`);
    }
}
exports.Migration1614880315925 = Migration1614880315925;
