"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1609781250597 = void 0;
class Migration1609781250597 {
    constructor() {
        this.name = 'Migration1609781250597';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "o_auth_token" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "token" character varying NOT NULL, "expiresAt" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f627e7380e58f41d1157094c0d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "o_auth_token" ADD CONSTRAINT "FK_cacccc1796e11c9350fc1544328" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "o_auth_token" DROP CONSTRAINT "FK_cacccc1796e11c9350fc1544328"`);
        await queryRunner.query(`DROP TABLE "o_auth_token"`);
    }
}
exports.Migration1609781250597 = Migration1609781250597;
//# sourceMappingURL=1609781250597-Migration.js.map